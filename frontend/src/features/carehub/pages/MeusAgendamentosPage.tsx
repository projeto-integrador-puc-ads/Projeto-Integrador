import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Button,
  Stack,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
  Badge,
} from '@mui/material';
import {
  CalendarToday,
  AccessTime,
  Person,
  CheckCircle,
  Cancel,
  HourglassEmpty,
} from '@mui/icons-material';
import { PageHeader } from '../components/PageHeader';
import http from '../libHttp';
import { getUserId } from '../components/auth';

interface Agendamento {
  id: number;
  clienteNome: string;
  dataHoraInicio: string;
  dataHoraFim: string;
  status: string;
  observacoes?: string;
  tipoAtendimento?: string;
}

interface ValidacaoInicio {
  podeIniciar: boolean;
  motivo?: string;
  inicioPermitido?: string;
}

const TIPOS_ATENDIMENTO: Record<string, string> = {
  'DOMICILIO': 'Atendimento Domiciliar',
  'ACOMPANHAMENTO': 'Acompanhamento',
  'PRESENCIAL': 'Atendimento Presencial',
  'EMERGENCIA': 'Emergência',
};

export function MeusAgendamentosPage() {
  const navigate = useNavigate();
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [validacoes, setValidacoes] = useState<Record<number, ValidacaoInicio>>({});
  const [tabAtual, setTabAtual] = useState(0);
  
  // ID do cuidador logado
  const cuidadorId = getUserId();

  useEffect(() => {
    carregarAgendamentos();
  }, [cuidadorId]);

  const carregarAgendamentos = async () => {
    try {
      setLoading(true);
      const response = await http.get(`/api/carehub/agendamentos/cuidador/${cuidadorId}`);
      setAgendamentos(response.data);
      
      // Verificar quais agendamentos CONFIRMADOS podem ser iniciados
      const validacoesTemp: Record<number, ValidacaoInicio> = {};
      for (const ag of response.data) {
        if (ag.status === 'CONFIRMADO') {
          try {
            const valResp = await http.get(`/api/carehub/agendamentos/${ag.id}/pode-iniciar`);
            validacoesTemp[ag.id] = {
              podeIniciar: valResp.data.podeIniciar,
              motivo: valResp.data.motivo,
              inicioPermitido: valResp.data.inicioPermitido,
            };
          } catch (err) {
            validacoesTemp[ag.id] = { podeIniciar: false, motivo: 'Erro ao validar' };
          }
        }
      }
      setValidacoes(validacoesTemp);
      setError(null);
    } catch (err) {
      console.error('Erro ao carregar agendamentos:', err);
      setError('Erro ao carregar agendamentos');
    } finally {
      setLoading(false);
    }
  };

  const atualizarStatus = async (agendamentoId: number, novoStatus: string) => {
    try {
      await http.put(
        `/api/carehub/agendamentos/${agendamentoId}/status?status=${novoStatus}`
      );
      
      // ✅ Se iniciou o atendimento, redireciona para registro de acompanhamento
      if (novoStatus === 'EM_ANDAMENTO') {
        navigate(`/carehub/registro-acompanhamento?agendamentoId=${agendamentoId}`);
      } else {
        carregarAgendamentos(); // Recarrega a lista para outros status
      }
    } catch (err: any) {
      console.error('Erro ao atualizar status:', err);
      
      // Se for erro de validação de horário, mostrar mensagem específica
      if (err.response?.status === 403 && err.response?.data?.message) {
        alert(err.response.data.message);
      } else {
        alert('Erro ao atualizar status do agendamento');
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDENTE':
        return 'warning'; // Aguardando confirmação do cuidador
      case 'CONFIRMADO':
        return 'success'; // Cuidador confirmou
      case 'EM_ANDAMENTO':
        return 'info'; // Atendimento em andamento
      case 'CONCLUIDO':
        return 'primary'; // Finalizado
      case 'CANCELADO':
        return 'error'; // Cancelado
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDENTE':
        return <HourglassEmpty />; // Aguardando
      case 'CONFIRMADO':
        return <CheckCircle />; // Confirmado
      case 'EM_ANDAMENTO':
        return <AccessTime />; // Em andamento
      case 'CONCLUIDO':
        return <CheckCircle />; // Concluído
      case 'CANCELADO':
        return <Cancel />; // Cancelado
      default:
        return <CalendarToday />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'PENDENTE':
        return 'Aguardando Confirmação';
      case 'CONFIRMADO':
        return 'Confirmado';
      case 'EM_ANDAMENTO':
        return 'Em Andamento';
      case 'CONCLUIDO':
        return 'Concluído';
      case 'CANCELADO':
        return 'Cancelado';
      default:
        return status;
    }
  };

  const formatarData = (dataISO: string) => {
    const data = new Date(dataISO);
    const hoje = new Date();
    const amanha = new Date(hoje);
    amanha.setDate(amanha.getDate() + 1);
    
    // Resetar horas para comparação apenas de datas
    hoje.setHours(0, 0, 0, 0);
    amanha.setHours(0, 0, 0, 0);
    const dataComparacao = new Date(data);
    dataComparacao.setHours(0, 0, 0, 0);
    
    if (dataComparacao.getTime() === hoje.getTime()) {
      return 'Hoje';
    } else if (dataComparacao.getTime() === amanha.getTime()) {
      return 'Amanhã';
    }
    
    return data.toLocaleDateString('pt-BR', { 
      weekday: 'short',
      day: '2-digit', 
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatarHorarioAtendimento = (inicio: string, fim: string) => {
    const dataInicio = new Date(inicio);
    const dataFim = new Date(fim);
    
    const horaInicio = dataInicio.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    const horaFim = dataFim.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    
    const duracao = Math.round((dataFim.getTime() - dataInicio.getTime()) / (1000 * 60)); // minutos
    const horas = Math.floor(duracao / 60);
    const minutos = duracao % 60;
    
    let duracaoTexto = '';
    if (horas > 0) {
      duracaoTexto = `${horas}h`;
      if (minutos > 0) duracaoTexto += ` ${minutos}min`;
    } else {
      duracaoTexto = `${minutos}min`;
    }
    
    return `${horaInicio} - ${horaFim} (${duracaoTexto})`;
  };

  // Filtrar agendamentos por categoria
  const agendamentosPendentes = agendamentos.filter(a => a.status === 'PENDENTE');
  const agendamentosConfirmados = agendamentos.filter(a => a.status === 'CONFIRMADO');
  const agendamentosEmAndamento = agendamentos.filter(a => a.status === 'EM_ANDAMENTO');
  const agendamentosFinalizados = agendamentos.filter(a => 
    a.status === 'CONCLUIDO' || a.status === 'CANCELADO'
  );

  const categorias = [
    { label: 'Pendentes', count: agendamentosPendentes.length, agendamentos: agendamentosPendentes },
    { label: 'Confirmados', count: agendamentosConfirmados.length, agendamentos: agendamentosConfirmados },
    { label: 'Em Andamento', count: agendamentosEmAndamento.length, agendamentos: agendamentosEmAndamento },
    { label: 'Finalizados', count: agendamentosFinalizados.length, agendamentos: agendamentosFinalizados },
  ];

  const agendamentosFiltrados = categorias[tabAtual].agendamentos;

  if (loading) {
    return (
      <Box>
        <PageHeader title="Meus Agendamentos" backTo="/carehub" />
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
          <CircularProgress />
        </Box>
      </Box>
    );
  }

  return (
    <Box>
      <PageHeader title="Meus Agendamentos" backTo="/carehub" />

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Abas de Filtro */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs 
          value={tabAtual} 
          onChange={(_, newValue) => setTabAtual(newValue)}
          variant="scrollable"
          scrollButtons="auto"
        >
          {categorias.map((cat, index) => (
            <Tab 
              key={index}
              label={
                <Badge badgeContent={cat.count} color="primary">
                  <Box sx={{ px: 1 }}>{cat.label}</Box>
                </Badge>
              }
            />
          ))}
        </Tabs>
      </Box>

      {agendamentosFiltrados.length === 0 ? (
        <Alert severity="info">
          {tabAtual === 0 && 'Nenhum agendamento pendente de confirmação.'}
          {tabAtual === 1 && 'Nenhum agendamento confirmado no momento.'}
          {tabAtual === 2 && 'Nenhum atendimento em andamento.'}
          {tabAtual === 3 && 'Nenhum agendamento finalizado.'}
        </Alert>
      ) : (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }, gap: 3 }}>
          {agendamentosFiltrados.map((agendamento) => (
            <Card
              key={agendamento.id}
              elevation={2}
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 6,
                  },
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  {/* Status */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Chip
                      icon={getStatusIcon(agendamento.status)}
                      label={getStatusLabel(agendamento.status)}
                      color={getStatusColor(agendamento.status)}
                      size="small"
                    />
                    <Typography variant="caption" color="text.secondary">
                      ID: {agendamento.id}
                    </Typography>
                  </Box>

                  {/* Cliente */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <Person color="primary" aria-label="Ícone de pessoa" />
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Cliente
                      </Typography>
                      <Typography variant="body1" fontWeight={600}>
                        {agendamento.clienteNome}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Data e Hora */}
                  <Stack spacing={1} sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CalendarToday fontSize="small" color="action" aria-label="Ícone de calendário" />
                      <Typography variant="body2">
                        {formatarData(agendamento.dataHoraInicio)}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <AccessTime fontSize="small" color="action" aria-label="Ícone de relógio" />
                      <Typography variant="body2">
                        {formatarHorarioAtendimento(agendamento.dataHoraInicio, agendamento.dataHoraFim)}
                      </Typography>
                    </Box>
                  </Stack>

                  {/* Tipo de Atendimento */}
                  {agendamento.tipoAtendimento && (
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      <strong>Tipo:</strong> {TIPOS_ATENDIMENTO[agendamento.tipoAtendimento] || agendamento.tipoAtendimento}
                    </Typography>
                  )}

                  {/* Observações */}
                  {agendamento.observacoes && (
                    <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                      "{agendamento.observacoes}"
                    </Typography>
                  )}
                </CardContent>

                {/* Ações */}
                {agendamento.status === 'PENDENTE' && (
                  <Box sx={{ p: 2, pt: 0 }}>
                    <Stack spacing={1}>
                      <Button
                        fullWidth
                        variant="contained"
                        color="success"
                        onClick={() => atualizarStatus(agendamento.id, 'CONFIRMADO')}
                      >
                        ✓ Confirmar Disponibilidade
                      </Button>
                      <Button
                        fullWidth
                        variant="outlined"
                        color="error"
                        onClick={() => atualizarStatus(agendamento.id, 'CANCELADO')}
                      >
                        ✕ Recusar Agendamento
                      </Button>
                    </Stack>
                  </Box>
                )}

                {agendamento.status === 'CONFIRMADO' && (
                  <Box sx={{ p: 2, pt: 0 }}>
                    <Stack spacing={1}>
                      {validacoes[agendamento.id] && !validacoes[agendamento.id].podeIniciar && (
                        <Alert severity="info" sx={{ fontSize: '0.85rem' }}>
                          <strong>Aguarde:</strong> {validacoes[agendamento.id].motivo}
                        </Alert>
                      )}
                      {validacoes[agendamento.id]?.podeIniciar && (
                        <Alert severity="success" sx={{ fontSize: '0.85rem' }}>
                          ✓ Você pode iniciar o atendimento agora!
                        </Alert>
                      )}
                      <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        onClick={() => atualizarStatus(agendamento.id, 'EM_ANDAMENTO')}
                        disabled={validacoes[agendamento.id] && !validacoes[agendamento.id].podeIniciar}
                      >
                        {validacoes[agendamento.id]?.podeIniciar 
                          ? '▶ Iniciar Atendimento' 
                          : '⏰ Aguardando Horário'}
                      </Button>
                      <Button
                        fullWidth
                        variant="outlined"
                        color="error"
                        size="small"
                        onClick={() => atualizarStatus(agendamento.id, 'CANCELADO')}
                      >
                        Cancelar
                      </Button>
                    </Stack>
                  </Box>
                )}

                {agendamento.status === 'EM_ANDAMENTO' && (
                  <Box sx={{ p: 2, pt: 0 }}>
                    <Stack spacing={1}>
                      <Alert severity="success" sx={{ fontSize: '0.85rem' }}>
                        Atendimento em andamento. Não esqueça de preencher o registro de acompanhamento!
                      </Alert>
                      <Button
                        fullWidth
                        variant="contained"
                        color="success"
                        onClick={() => atualizarStatus(agendamento.id, 'CONCLUIDO')}
                      >
                        ✓ Finalizar Atendimento
                      </Button>
                    </Stack>
                  </Box>
                )}

                {(agendamento.status === 'CONCLUIDO' || agendamento.status === 'CANCELADO') && (
                  <Box sx={{ p: 2, pt: 0 }}>
                    <Alert 
                      severity={agendamento.status === 'CONCLUIDO' ? 'success' : 'error'} 
                      sx={{ fontSize: '0.85rem' }}
                    >
                      {agendamento.status === 'CONCLUIDO' 
                        ? '✓ Atendimento concluído com sucesso!' 
                        : '✕ Este agendamento foi cancelado.'}
                    </Alert>
                  </Box>
                )}
              </Card>
          ))}
        </Box>
      )}
    </Box>
  );
}
