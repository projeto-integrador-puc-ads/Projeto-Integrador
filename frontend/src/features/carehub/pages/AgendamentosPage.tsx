import { useEffect, useState } from 'react';
import { agendamentosApi, cuidadoresApi, clientesApi } from '../api';
import type { AgendamentoRequestDTO } from '../types';
import { Box, Button, Card, CardContent, Chip, CircularProgress, MenuItem, Stack, TextField, Typography, Paper, Divider, Alert } from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from '../libSnackbar';
import { PageHeader } from '../components/PageHeader';
import dayjs from 'dayjs';
import { CalendarMonth, Schedule, CheckCircle, Cancel, AccessTime, Person, LocationOn } from '@mui/icons-material';

import { getUserId, isCuidador as isRoleCuidador, checkAndCacheUserType } from '../components/auth';

export default function AgendamentosPage() {
  // feature-level accessibility styles
  import('../components/carehub-accessibility.css');
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const [isCuidador, setIsCuidador] = useState<boolean>(false);
  const params = new URLSearchParams(window.location.search);
  const initialCuidador = Number(params.get('cuidadorId') || '') || undefined;
  
  const [clienteId, setClienteId] = useState<number | undefined>(undefined);
  const [cuidadorId, setCuidadorId] = useState<number | undefined>(initialCuidador);
  const [inicio, setInicio] = useState<string>(dayjs().add(1, 'day').hour(9).minute(0).second(0).millisecond(0).format('YYYY-MM-DDTHH:mm'));
  const [fim, setFim] = useState<string>(dayjs().add(1, 'day').hour(11).minute(0).second(0).millisecond(0).format('YYYY-MM-DDTHH:mm'));
  const [tipo, setTipo] = useState<string>('DOMICILIO'); // ✅ Corrigido de DOMICILIAR para DOMICILIO
  
  // Filtros de visualização
  const [filtroData, setFiltroData] = useState<string>('');
  const [filtroStatus, setFiltroStatus] = useState<string>('TODOS');
  const [filtroTipo, setFiltroTipo] = useState<string>('TODOS');

  // Inicialização: cache do tipo de usuário e fetch cliente ID
  useEffect(() => {
    const inicializar = async () => {
      await checkAndCacheUserType();
      setIsCuidador(isRoleCuidador());
      
      const uid = getUserId();
      if (uid) {
        setClienteId(uid);
        return;
      }

      clientesApi.listarTodos().then((arr) => setClienteId(arr[0]?.id));
    };
    inicializar();
  }, []);

  // Fetch cuidadores list
  const { data: cuidadores = [] } = useQuery({
    queryKey: ['cuidadores-list'],
    queryFn: async () => {
      const arr = await cuidadoresApi.listarTodos();
      return arr.map(c => ({ id: c.id, nome: c.nome }));
    },
  });

  // Fetch agendamentos - APENAS quando tiver clienteId ou cuidadorId
  const { data: lista = [], isLoading, isError } = useQuery({
    queryKey: ['agendamentos', cuidadorId, clienteId],
    queryFn: async () => {
      if (cuidadorId) return agendamentosApi.porCuidador(cuidadorId);
      if (clienteId) return agendamentosApi.porCliente(clienteId);
      return [];
    },
    enabled: !!(cuidadorId || clienteId), // CRUCIAL: só busca quando tem ID
    staleTime: 5000, // Cache por 5 segundos
  });

  // Criar agendamento
  const criarMutation = useMutation({
    mutationFn: (dto: AgendamentoRequestDTO) => agendamentosApi.criar(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agendamentos'] });
      enqueueSnackbar('Agendamento criado com sucesso!', { variant: 'success' });
      setInicio(dayjs().add(1, 'day').hour(9).minute(0).second(0).millisecond(0).format('YYYY-MM-DDTHH:mm'));
      setFim(dayjs().add(1, 'day').hour(11).minute(0).second(0).millisecond(0).format('YYYY-MM-DDTHH:mm'));
    },
    onError: (error: any) => {
      const msg = error?.message || 'Erro ao criar agendamento';
      enqueueSnackbar(msg, { variant: 'error' });
    },
  });

  // Atualizar status
  const atualizarStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) => 
      agendamentosApi.atualizarStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agendamentos'] });
      enqueueSnackbar('Status atualizado!', { variant: 'success' });
    },
    onError: (error: any) => {
      const msg = error?.message || 'Erro ao atualizar status';
      enqueueSnackbar(msg, { variant: 'error' });
    },
  });

  const criar = () => {
    if (!cuidadorId || !clienteId) {
      enqueueSnackbar('Selecione um cuidador', { variant: 'warning' });
      return;
    }
    
    const dInicio = dayjs(inicio);
    const dFim = dayjs(fim);

    // Validações simples no cliente
    if (dFim.isBefore(dInicio)) {
      enqueueSnackbar('A data/hora de fim deve ser posterior à de início', { variant: 'warning' });
      return;
    }

    if (dInicio.isBefore(dayjs())) {
      enqueueSnackbar('A data/hora de início não pode ser no passado', { variant: 'warning' });
      return;
    }

    // ✅ Usar formato local sem conversão para UTC
    const dataInicio = dInicio.format('YYYY-MM-DDTHH:mm:ss');
    const dataFim = dFim.format('YYYY-MM-DDTHH:mm:ss');

    criarMutation.mutate({ 
      clienteId, 
      cuidadorId, 
      dataHoraInicio: dataInicio, 
      dataHoraFim: dataFim, 
      tipoAtendimento: tipo 
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMADO': return 'success';
      case 'CANCELADO': return 'error';
      case 'CONCLUIDO': return 'info';
      default: return 'warning';
    }
  };

  return (
    <Stack gap={3} sx={{ p: 2 }}>
      {/* Header com botão VOLTAR */}
      <PageHeader 
        title="Agendamentos"
        subtitle="Gerencie seus atendimentos e horários"
      />

      {/* Formulário de Criação - somente para clientes (idosos/familiares) */}
      {!isCuidador ? (
        <Card variant="outlined" sx={{ bgcolor: 'background.default' }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>Novo Agendamento</Typography>
            <Stack direction={{ xs: 'column', md: 'row' }} gap={2} flexWrap="wrap">
              <TextField 
                select 
                label="Cuidador" 
                value={cuidadorId ?? ''} 
                onChange={(e) => setCuidadorId(Number(e.target.value) || undefined)} 
                size="small" 
                sx={{ minWidth: 220 }}
                required
              >
                <MenuItem value="">Selecione um cuidador</MenuItem>
                {cuidadores.map(c => <MenuItem key={c.id} value={c.id}>{c.nome}</MenuItem>)}
              </TextField>
              
              <TextField 
                label="Data/Hora Início" 
                type="datetime-local" 
                size="small" 
                value={inicio} 
                onChange={(e) => setInicio(e.target.value)}
                InputLabelProps={{ shrink: true }}
                sx={{ minWidth: 200 }}
              />
              
              <TextField 
                label="Data/Hora Fim" 
                type="datetime-local" 
                size="small" 
                value={fim} 
                onChange={(e) => setFim(e.target.value)}
                InputLabelProps={{ shrink: true }}
                sx={{ minWidth: 200 }}
              />
              
              <TextField 
                select
                label="Tipo Atendimento" 
                size="small" 
                value={tipo} 
                onChange={(e) => setTipo(e.target.value)}
                sx={{ minWidth: 180 }}
              >
                <MenuItem value="DOMICILIO">Domiciliar</MenuItem>
                <MenuItem value="PRESENCIAL">Presencial</MenuItem>
                <MenuItem value="ACOMPANHAMENTO">Acompanhamento</MenuItem>
              </TextField>
              
              <Button 
                variant="contained" 
                onClick={criar} 
                disabled={criarMutation.isPending || !clienteId || !cuidadorId}
                sx={{ minWidth: 120 }}
              >
                {criarMutation.isPending ? 'Criando...' : 'Criar'}
              </Button>
            </Stack>
          </CardContent>
        </Card>
      ) : (
        <Alert severity="info" sx={{ borderRadius: 2 }}>
          Você está logado como cuidador. Agendamentos devem ser propostos por clientes (idosos/familiares). Acompanhe e confirme propostas em <strong>Meus Agendamentos</strong>.
        </Alert>
      )}

      {/* Filtros de Visualização */}
      {lista.length > 0 && (
        <Card variant="outlined" sx={{ bgcolor: 'background.default', mb: 3 }}>
          <CardContent>
            <Typography variant="subtitle1" gutterBottom fontWeight={600}>
              Filtros
            </Typography>
            <Stack direction={{ xs: 'column', md: 'row' }} gap={2}>
              <TextField
                label="Filtrar por Data"
                type="date"
                size="small"
                value={filtroData}
                onChange={(e) => setFiltroData(e.target.value)}
                InputLabelProps={{ shrink: true }}
                sx={{ minWidth: 200 }}
                helperText="Deixe vazio para ver todos"
              />
              
              <TextField
                select
                label="Status"
                size="small"
                value={filtroStatus}
                onChange={(e) => setFiltroStatus(e.target.value)}
                sx={{ minWidth: 180 }}
              >
                <MenuItem value="TODOS">Todos os status</MenuItem>
                <MenuItem value="PENDENTE">Pendente</MenuItem>
                <MenuItem value="CONFIRMADO">Confirmado</MenuItem>
                <MenuItem value="EM_ANDAMENTO">Em Andamento</MenuItem>
                <MenuItem value="CONCLUIDO">Concluído</MenuItem>
                <MenuItem value="CANCELADO">Cancelado</MenuItem>
                <MenuItem value="REAGENDADO">Reagendado</MenuItem>
              </TextField>
              
              <TextField
                select
                label="Tipo de Atendimento"
                size="small"
                value={filtroTipo}
                onChange={(e) => setFiltroTipo(e.target.value)}
                sx={{ minWidth: 200 }}
              >
                <MenuItem value="TODOS">Todos os tipos</MenuItem>
                <MenuItem value="DOMICILIO">Domiciliar</MenuItem>
                <MenuItem value="PRESENCIAL">Presencial</MenuItem>
                <MenuItem value="ACOMPANHAMENTO">Acompanhamento</MenuItem>
              </TextField>

              {(filtroData || filtroStatus !== 'TODOS' || filtroTipo !== 'TODOS') && (
                <Button
                  variant="outlined"
                  onClick={() => {
                    setFiltroData('');
                    setFiltroStatus('TODOS');
                    setFiltroTipo('TODOS');
                  }}
                  size="small"
                >
                  Limpar Filtros
                </Button>
              )}
            </Stack>
          </CardContent>
        </Card>
      )}

      {/* Lista de Agendamentos */}
      {isLoading && (
        <Stack alignItems="center" py={4}>
          <CircularProgress />
          <Typography variant="body2" color="text.secondary" mt={2}>
            Carregando agendamentos...
          </Typography>
        </Stack>
      )}
      
      {isError && (
        <Card sx={{ bgcolor: 'error.light', color: 'error.contrastText' }}>
          <CardContent>
            <Typography>Erro ao carregar agendamentos. Tente novamente.</Typography>
          </CardContent>
        </Card>
      )}

      {!isLoading && lista.length === 0 && (
        <Card variant="outlined" sx={{ py: 6, textAlign: 'center' }}>
          <Schedule sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
          <Typography color="text.secondary">
            Nenhum agendamento encontrado. Crie o primeiro!
          </Typography>
        </Card>
      )}

      <Box display="grid" gridTemplateColumns={{ xs: '1fr', md: '1fr 1fr' }} gap={3}>
        {lista
          .filter((a) => {
            // Filtro por data
            if (filtroData) {
              const dataAgendamento = dayjs(a.dataHoraInicio).format('YYYY-MM-DD');
              if (dataAgendamento !== filtroData) return false;
            }
            
            // Filtro por status
            if (filtroStatus !== 'TODOS' && a.status !== filtroStatus) {
              return false;
            }
            
            // Filtro por tipo
            if (filtroTipo !== 'TODOS' && a.tipoAtendimento !== filtroTipo) {
              return false;
            }
            
            return true;
          })
          .map((a) => {
          const isPast = dayjs(a.dataHoraFim).isBefore(dayjs());
          const isNow = dayjs().isAfter(dayjs(a.dataHoraInicio)) && dayjs().isBefore(dayjs(a.dataHoraFim));
          
          return (
            <Card 
              key={a.id} 
              sx={{ 
                position: 'relative',
                overflow: 'visible',
                border: '2px solid',
                borderColor: isNow ? 'success.main' : 'transparent',
                transition: 'all 0.3s',
                '&:hover': { 
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
                }
              }}
            >
              {/* Badge de status visual */}
              {isNow && (
                <Box 
                  sx={{ 
                    position: 'absolute',
                    top: -10,
                    right: 16,
                    bgcolor: 'success.main',
                    color: 'white',
                    px: 2,
                    py: 0.5,
                    borderRadius: 2,
                    fontSize: '0.75rem',
                    fontWeight: 'bold',
                    boxShadow: '0 4px 12px rgba(46, 125, 50, 0.3)',
                    animation: 'pulse 2s infinite'
                  }}
                >
                  ● EM ANDAMENTO
                </Box>
              )}
              
              <CardContent sx={{ p: 3 }}>
                {/* Header */}
                <Stack direction="row" justifyContent="space-between" alignItems="start" mb={2}>
                  <Box>
                    <Typography variant="caption" color="text.secondary" fontWeight="medium">
                      AGENDAMENTO #{a.id}
                    </Typography>
                    <Typography variant="h6" fontWeight="bold" mt={0.5}>
                      {a.cuidadorNome || 'Cuidador'}
                    </Typography>
                  </Box>
                  <Chip 
                    label={a.status} 
                    color={getStatusColor(a.status)}
                    size="small"
                    sx={{ fontWeight: 'bold' }}
                    icon={
                      a.status === 'CONFIRMADO' ? <CheckCircle fontSize="small" /> :
                      a.status === 'CANCELADO' ? <Cancel fontSize="small" /> :
                      <AccessTime fontSize="small" />
                    }
                  />
                </Stack>

                <Divider sx={{ mb: 2 }} />
                
                {/* Informações principais */}
                <Stack spacing={1.5} mb={2}>
                  <Stack direction="row" alignItems="center" gap={1}>
                    <Person fontSize="small" color="action" />
                    <Typography variant="body2">
                      <strong>Cliente:</strong> {a.clienteNome || '-'}
                    </Typography>
                  </Stack>
                  
                  <Stack direction="row" alignItems="center" gap={1}>
                    <LocationOn fontSize="small" color="action" />
                    <Typography variant="body2">
                      <strong>Tipo:</strong> {a.tipoAtendimento || 'Não especificado'}
                    </Typography>
                  </Stack>
                </Stack>
                
                {/* Timeline visual */}
                <Paper 
                  elevation={0} 
                  sx={{ 
                    bgcolor: isPast ? 'grey.100' : isNow ? 'success.50' : 'primary.50',
                    p: 2, 
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: isPast ? 'grey.300' : isNow ? 'success.200' : 'primary.200',
                    mb: 2
                  }}
                >
                  <Stack direction="row" alignItems="center" gap={1} mb={1}>
                    <AccessTime fontSize="small" color={isNow ? 'success' : 'action'} />
                    <Typography variant="caption" fontWeight="medium" color="text.secondary">
                      {isPast ? 'CONCLUÍDO' : isNow ? 'ACONTECENDO AGORA' : 'AGENDADO PARA'}
                    </Typography>
                  </Stack>
                  <Stack direction="row" alignItems="center" gap={1} flexWrap="wrap">
                    <Chip 
                      icon={<CalendarMonth fontSize="small" />}
                      label={dayjs(a.dataHoraInicio).format('DD/MM/YYYY')}
                      size="small"
                      variant="outlined"
                      sx={{ fontWeight: 'medium' }}
                    />
                    <Typography variant="body2" fontWeight="bold">
                      {dayjs(a.dataHoraInicio).format('HH:mm')} → {dayjs(a.dataHoraFim).format('HH:mm')}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      ({dayjs(a.dataHoraFim).diff(dayjs(a.dataHoraInicio), 'hour')}h)
                    </Typography>
                  </Stack>
                </Paper>
                
                {/* Observações */}
                {a.observacoes && (
                  <Paper 
                    elevation={0} 
                    sx={{ 
                      bgcolor: 'grey.50', 
                      p: 1.5, 
                      borderRadius: 1,
                      mb: 2,
                      border: '1px dashed',
                      borderColor: 'grey.300'
                    }}
                  >
                    <Typography variant="caption" color="text.secondary" fontWeight="medium" display="block" mb={0.5}>
                      OBSERVAÇÕES
                    </Typography>
                    <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                      "{a.observacoes}"
                    </Typography>
                  </Paper>
                )}
                
                {/* Botões de ação */}
                <Stack direction="row" gap={1}>
                  {a.clienteId === clienteId && (
                    <Button 
                      size="small" 
                      variant="outlined"
                      color="error"
                      disabled={atualizarStatusMutation.isPending || a.status === 'CANCELADO'}
                      onClick={() => atualizarStatusMutation.mutate({ id: a.id, status: 'CANCELADO' })}
                      fullWidth
                      startIcon={<Cancel />}
                      sx={{ borderRadius: 1.5 }}
                    >
                      Cancelar
                    </Button>
                  )}

                  {isCuidador && a.cuidadorId === getUserId() && a.status !== 'CONFIRMADO' && a.status !== 'CANCELADO' && (
                    <Button 
                      size="small" 
                      variant="outlined"
                      color="success"
                      disabled={atualizarStatusMutation.isPending}
                      onClick={() => atualizarStatusMutation.mutate({ id: a.id, status: 'CONFIRMADO' })}
                      fullWidth
                      startIcon={<CheckCircle />}
                      sx={{ borderRadius: 1.5 }}
                    >
                      Confirmar
                    </Button>
                  )}
                </Stack>
              </CardContent>
            </Card>
          );
        })}
      </Box>
    </Stack>
  );
}
