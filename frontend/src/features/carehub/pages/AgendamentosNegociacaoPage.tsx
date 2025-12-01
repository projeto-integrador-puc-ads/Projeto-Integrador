import { useEffect, useState } from 'react';
import { agendamentosApi, cuidadoresApi } from '../api';
import type { AgendamentoRequestDTO } from '../types';
import { 
  Box, Button, Card, CardContent, Chip, CircularProgress, MenuItem, Stack, 
  TextField, Typography, Paper, Divider, Alert, Dialog, DialogTitle, 
  DialogContent, DialogActions
} from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from '../libSnackbar';
import { PageHeader } from '../components/PageHeader';
import dayjs from 'dayjs';
import { 
  CalendarMonth, Schedule, CheckCircle, Cancel, AccessTime, 
  Person, Pending, Edit, EventAvailable
} from '@mui/icons-material';

/**
 * Sistema de Agendamento com Negociação
 * 
 * Fluxo:
 * 1. Cliente cria proposta de agendamento (status: PENDENTE)
 * 2. Cuidador pode:
 *    - CONFIRMAR (aceitar data/hora proposta)
 *    - PROPOR NOVA DATA (sugere horário alternativo, status: REAGENDADO)
 * 3. Cliente pode aceitar a contraproposta ou propor novamente
 * 4. Quando confirmado por ambos, status vira: CONFIRMADO
 */

import { getUserId, isCuidador as isRoleCuidador } from '../components/auth';

export default function AgendamentosNegociacaoPage() {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const isCuidador = isRoleCuidador();
  const params = new URLSearchParams(window.location.search);
  const initialCuidador = Number(params.get('cuidadorId') || '') || undefined;
  
  const [clienteId, setClienteId] = useState<number | undefined>(getUserId() || undefined);
  const [cuidadorId, setCuidadorId] = useState<number | undefined>(initialCuidador);
  const [inicio, setInicio] = useState<string>(
    dayjs().add(1, 'day').hour(9).minute(0).second(0).millisecond(0).format('YYYY-MM-DDTHH:mm')
  );
  const [fim, setFim] = useState<string>(
    dayjs().add(1, 'day').hour(11).minute(0).second(0).millisecond(0).format('YYYY-MM-DDTHH:mm')
  );
  const [tipo, setTipo] = useState<string>('DOMICILIO'); // ✅ Corrigido de DOMICILIAR para DOMICILIO
  const [observacoes, setObservacoes] = useState<string>('');
  
  // Estado para modal de contraproposta (funcionalidade futura)
  const [modalOpen, setModalOpen] = useState(false);

  // Garantir clienteId vindo do usuário autenticado se disponível
  useEffect(() => {
    const uid = getUserId();
    if (uid) setClienteId(uid);
  }, []);

  // Fetch cuidadores list
  const { data: cuidadores = [] } = useQuery({
    queryKey: ['cuidadores-list'],
    queryFn: async () => {
      const arr = await cuidadoresApi.listarTodos();
      return arr.map(c => ({ id: c.id, nome: c.nome }));
    },
  });

  // Fetch agendamentos do cliente
  const { data: lista = [], isLoading, isError } = useQuery({
    queryKey: ['agendamentos-cliente', clienteId],
    queryFn: async () => {
      if (!clienteId) return [];
      return agendamentosApi.porCliente(clienteId);
    },
    enabled: !!clienteId,
    staleTime: 5000,
  });

  // Criar proposta de agendamento
  const criarMutation = useMutation({
    mutationFn: (dto: AgendamentoRequestDTO) => agendamentosApi.criar(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agendamentos-cliente'] });
      enqueueSnackbar('✅ Proposta de agendamento enviada ao cuidador!', { variant: 'success' });
      setInicio(dayjs().add(1, 'day').hour(9).minute(0).second(0).millisecond(0).format('YYYY-MM-DDTHH:mm'));
      setFim(dayjs().add(1, 'day').hour(11).minute(0).second(0).millisecond(0).format('YYYY-MM-DDTHH:mm'));
      setObservacoes('');
    },
    onError: (error: any) => {
      // Nosso http client normaliza erros como { status, message, data, original }
      const message = error?.message || error?.data?.message || 'Erro ao criar proposta de agendamento';
      enqueueSnackbar(message, { variant: 'error' });
    },
  });

  // Atualizar status (aceitar proposta do cuidador)
  const aceitarPropostaMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) => 
      agendamentosApi.atualizarStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agendamentos-cliente'] });
      enqueueSnackbar('✅ Proposta aceita! Agendamento confirmado.', { variant: 'success' });
    },
    onError: () => {
      enqueueSnackbar('Erro ao aceitar proposta', { variant: 'error' });
    },
  });

  // Cancelar agendamento
  const cancelarMutation = useMutation({
    mutationFn: (id: number) => agendamentosApi.atualizarStatus(id, 'CANCELADO'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agendamentos-cliente'] });
      enqueueSnackbar('Agendamento cancelado', { variant: 'info' });
    },
    onError: () => {
      enqueueSnackbar('Erro ao cancelar', { variant: 'error' });
    },
  });

  const handleCriarProposta = () => {
    if (!cuidadorId || !clienteId) {
      enqueueSnackbar('Selecione um cuidador', { variant: 'warning' });
      return;
    }
    
    const dataInicio = dayjs(inicio);
    const dataFim = dayjs(fim);
    
    if (dataFim.isBefore(dataInicio)) {
      enqueueSnackbar('A data/hora de fim deve ser posterior à de início', { variant: 'warning' });
      return;
    }
    // Não permitir agendamentos no passado
    if (dataInicio.isBefore(dayjs())) {
      enqueueSnackbar('A data/hora de início não pode ser no passado', { variant: 'warning' });
      return;
    }
    
    // ✅ Usar formato local sem conversão para UTC
    criarMutation.mutate({ 
      clienteId, 
      cuidadorId, 
      dataHoraInicio: dataInicio.format('YYYY-MM-DDTHH:mm:ss'), 
      dataHoraFim: dataFim.format('YYYY-MM-DDTHH:mm:ss'), 
      tipoAtendimento: tipo,
      observacoes: observacoes.trim() || undefined
    });
  };

  const handleAbrirContraproposta = () => {
    setModalOpen(true);
  };

  const handleAceitarProposta = (id: number) => {
    aceitarPropostaMutation.mutate({ id, status: 'CONFIRMADO' });
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'PENDENTE':
        return { 
          color: 'warning' as const, 
          label: 'Aguardando Confirmação',
          icon: <Pending />
        };
      case 'CONFIRMADO':
        return { 
          color: 'success' as const, 
          label: 'Confirmado',
          icon: <CheckCircle />
        };
      case 'REAGENDADO':
        return { 
          color: 'info' as const, 
          label: 'Nova Data Proposta',
          icon: <Edit />
        };
      case 'CANCELADO':
        return { 
          color: 'error' as const, 
          label: 'Cancelado',
          icon: <Cancel />
        };
      case 'CONCLUIDO':
        return { 
          color: 'default' as const, 
          label: 'Concluído',
          icon: <EventAvailable />
        };
      default:
        return { 
          color: 'default' as const, 
          label: status,
          icon: <Schedule />
        };
    }
  };

  return (
    <Stack gap={3} sx={{ p: 2 }}>
      {/* Header com botão VOLTAR */}
      <PageHeader 
        title="Agendamentos"
        subtitle="Proponha horários e negocie com o cuidador"
        backTo="/carehub"
      />

      {/* Informativo */}
      <Alert severity="info" sx={{ borderRadius: 2 }}>
        <Typography variant="body2" fontWeight="medium" mb={1}>
          Como funciona o agendamento:
        </Typography>
        <Typography variant="caption" component="div">
          1. Você propõe uma data e horário<br/>
          2. O cuidador pode aceitar ou propor nova data<br/>
          3. Você pode aceitar a contraproposta ou negociar novamente<br/>
          4. Quando ambos concordarem, o status fica "Confirmado"
        </Typography>
      </Alert>

      {/* Formulário de Nova Proposta - somente clientes podem propor */}
      {!isCuidador ? (
        <Card 
          variant="outlined" 
          sx={{ 
            bgcolor: 'background.default',
            border: '2px solid',
            borderColor: 'primary.main'
          }}
        >
          <CardContent>
            <Stack direction="row" alignItems="center" gap={1} mb={2}>
              <CalendarMonth color="primary" />
              <Typography variant="h6" fontWeight="bold">
                Nova Proposta de Agendamento
              </Typography>
            </Stack>
            
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
                {cuidadores.map(c => (
                  <MenuItem key={c.id} value={c.id}>
                    {c.nome}
                  </MenuItem>
                ))}
              </TextField>
              
              <TextField 
                label="Data/Hora Início" 
                type="datetime-local" 
                size="small" 
                value={inicio} 
                onChange={(e) => setInicio(e.target.value)}
                InputLabelProps={{ shrink: true }}
                sx={{ minWidth: 200 }}
                required
              />
              
              <TextField 
                label="Data/Hora Fim" 
                type="datetime-local" 
                size="small" 
                value={fim} 
                onChange={(e) => setFim(e.target.value)}
                InputLabelProps={{ shrink: true }}
                sx={{ minWidth: 200 }}
                required
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
            </Stack>

            <TextField 
              label="Observações (opcional)" 
              multiline
              rows={2}
              fullWidth
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              placeholder="Ex: Preferência de horário matutino, necessidades especiais..."
              sx={{ mt: 2 }}
            />
            
            <Button 
              variant="contained" 
              onClick={handleCriarProposta} 
              disabled={criarMutation.isPending || !clienteId || !cuidadorId}
              sx={{ 
                mt: 2, 
                minWidth: 200,
                py: 1.5,
                fontSize: '1rem',
                fontWeight: 'bold'
              }}
              size="large"
            >
              {criarMutation.isPending ? 'Enviando...' : '📤 Enviar Proposta'}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Alert severity="info" sx={{ borderRadius: 2 }}>
          Acesse sua área de cuidador para conferir propostas recebidas e confirmar disponibilidade para os dias propostos pelos clientes.
        </Alert>
      )}

      {/* Lista de Agendamentos */}
      <Typography variant="h6" fontWeight="bold" mt={2}>
        Meus Agendamentos
      </Typography>

      {isLoading && (
        <Stack alignItems="center" py={4}>
          <CircularProgress />
          <Typography variant="body2" color="text.secondary" mt={2}>
            Carregando agendamentos...
          </Typography>
        </Stack>
      )}
      
      {isError && (
        <Alert severity="error">
          Erro ao carregar agendamentos. Tente novamente.
        </Alert>
      )}

      {!isLoading && lista.length === 0 && (
        <Card variant="outlined" sx={{ py: 6, textAlign: 'center' }}>
          <Schedule sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
          <Typography color="text.secondary">
            Nenhum agendamento ainda. Crie sua primeira proposta!
          </Typography>
        </Card>
      )}

      <Box display="grid" gridTemplateColumns={{ xs: '1fr', md: '1fr 1fr' }} gap={3}>
        {lista.map((a) => {
          const statusInfo = getStatusInfo(a.status);
          const isPendente = a.status === 'PENDENTE';
          const isReagendado = a.status === 'REAGENDADO';
          
          return (
            <Card 
              key={a.id}
              sx={{ 
                borderLeft: '4px solid',
                borderColor: `${statusInfo.color}.main`,
                transition: 'all 0.3s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4
                }
              }}
            >
              <CardContent>
                {/* Header do Card */}
                <Stack direction="row" justifyContent="space-between" alignItems="start" mb={2}>
                  <Box>
                    <Stack direction="row" alignItems="center" gap={1} mb={1}>
                      <Person fontSize="small" color="primary" />
                      <Typography variant="subtitle1" fontWeight="bold">
                        {a.cuidadorNome}
                      </Typography>
                    </Stack>
                    <Chip 
                      label={statusInfo.label}
                      color={statusInfo.color}
                      size="small"
                      icon={statusInfo.icon}
                      sx={{ fontWeight: 'bold' }}
                    />
                  </Box>
                </Stack>

                <Divider sx={{ my: 2 }} />

                {/* Detalhes do Agendamento */}
                <Stack spacing={1.5}>
                  <Stack direction="row" alignItems="center" gap={1}>
                    <CalendarMonth fontSize="small" color="action" />
                    <Typography variant="body2">
                      <strong>Início:</strong> {dayjs(a.dataHoraInicio).format('DD/MM/YYYY [às] HH:mm')}
                    </Typography>
                  </Stack>
                  
                  <Stack direction="row" alignItems="center" gap={1}>
                    <AccessTime fontSize="small" color="action" />
                    <Typography variant="body2">
                      <strong>Fim:</strong> {dayjs(a.dataHoraFim).format('DD/MM/YYYY [às] HH:mm')}
                    </Typography>
                  </Stack>

                  {a.tipoAtendimento && (
                    <Typography variant="body2" color="text.secondary">
                      <strong>Tipo:</strong> {a.tipoAtendimento}
                    </Typography>
                  )}

                  {a.observacoes && (
                    <Paper 
                      elevation={0} 
                      sx={{ 
                        bgcolor: 'grey.50', 
                        p: 1.5, 
                        borderRadius: 1,
                        mt: 1
                      }}
                    >
                      <Typography variant="caption" color="text.secondary" fontWeight="medium">
                        Observações:
                      </Typography>
                      <Typography variant="body2" mt={0.5}>
                        {a.observacoes}
                      </Typography>
                    </Paper>
                  )}
                </Stack>

                {/* Ações */}
                {isReagendado && !isCuidador && (
                  <Alert severity="warning" sx={{ mt: 2, borderRadius: 2 }}>
                    <Typography variant="body2" fontWeight="medium" mb={1}>
                      O cuidador propôs uma nova data!
                    </Typography>
                    <Stack direction="row" gap={1}>
                      <Button 
                        size="small" 
                        variant="contained" 
                        color="success"
                        onClick={() => handleAceitarProposta(a.id)}
                        startIcon={<CheckCircle />}
                      >
                        Aceitar Nova Data
                      </Button>
                      <Button 
                        size="small" 
                        variant="outlined"
                        onClick={handleAbrirContraproposta}
                        startIcon={<Edit />}
                      >
                        Propor Outra Data
                      </Button>
                    </Stack>
                  </Alert>
                )}

                {isPendente && (
                  <Alert severity="info" sx={{ mt: 2, borderRadius: 2 }}>
                    <Typography variant="body2">
                      Aguardando confirmação do cuidador...
                    </Typography>
                  </Alert>
                )}

                {/* Botões de ação gerais */}
                <Stack direction="row" gap={1} mt={2}>
                  {(isPendente || isReagendado) && a.clienteId === clienteId && (
                    <Button 
                      size="small" 
                      variant="outlined" 
                      color="error"
                      onClick={() => cancelarMutation.mutate(a.id)}
                      startIcon={<Cancel />}
                      fullWidth
                    >
                      Cancelar
                    </Button>
                  )}
                </Stack>
              </CardContent>
            </Card>
          );
        })}
      </Box>

      {/* Modal de Contraproposta - NÃO IMPLEMENTADO AINDA */}
      <Dialog open={modalOpen} onClose={() => setModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          Propor Nova Data
        </DialogTitle>
        <DialogContent>
          <Alert severity="info" sx={{ mb: 2 }}>
            Esta funcionalidade será implementada na próxima versão.
            Por enquanto, cancele e crie uma nova proposta.
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setModalOpen(false)}>Fechar</Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}
