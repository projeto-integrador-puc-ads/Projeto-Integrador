import { useState, useEffect } from 'react';
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
import axios from 'axios';

interface Agendamento {
  id: number;
  clienteNome: string;
  dataHoraInicio: string;
  dataHoraFim: string;
  status: string;
  observacoes?: string;
  tipoAtendimento?: string;
}

export function MeusAgendamentosPage() {
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // ID do cuidador logado (João Cuidador = ID 3)
  const cuidadorId = parseInt(localStorage.getItem('devUserId') || '3');

  useEffect(() => {
    carregarAgendamentos();
  }, [cuidadorId]);

  const carregarAgendamentos = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:8080/api/carehub/agendamentos/cuidador/${cuidadorId}`);
      setAgendamentos(response.data);
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
      await axios.put(
        `http://localhost:8080/api/carehub/agendamentos/${agendamentoId}/status?status=${novoStatus}`
      );
      carregarAgendamentos(); // Recarrega a lista
    } catch (err) {
      console.error('Erro ao atualizar status:', err);
      alert('Erro ao atualizar status do agendamento');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMADO':
        return 'success';
      case 'AGENDADO':
        return 'info';
      case 'EM_ANDAMENTO':
        return 'warning';
      case 'CONCLUIDO':
        return 'primary';
      case 'CANCELADO':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'CONFIRMADO':
        return <CheckCircle />;
      case 'AGENDADO':
        return <HourglassEmpty />;
      case 'CANCELADO':
        return <Cancel />;
      default:
        return <CalendarToday />;
    }
  };

  const formatarData = (dataISO: string) => {
    const data = new Date(dataISO);
    return data.toLocaleDateString('pt-BR');
  };

  const formatarHora = (dataISO: string) => {
    const data = new Date(dataISO);
    return data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return (
      <Box>
        <PageHeader title="Meus Agendamentos" />
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
          <CircularProgress />
        </Box>
      </Box>
    );
  }

  return (
    <Box>
      <PageHeader title="Meus Agendamentos" />

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {agendamentos.length === 0 ? (
        <Alert severity="info">
          Você ainda não tem agendamentos.
        </Alert>
      ) : (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }, gap: 3 }}>
          {agendamentos.map((agendamento) => (
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
                      label={agendamento.status}
                      color={getStatusColor(agendamento.status)}
                      size="small"
                    />
                    <Typography variant="caption" color="text.secondary">
                      ID: {agendamento.id}
                    </Typography>
                  </Box>

                  {/* Cliente */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <Person color="primary" />
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
                      <CalendarToday fontSize="small" color="action" />
                      <Typography variant="body2">
                        {formatarData(agendamento.dataHoraInicio)}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <AccessTime fontSize="small" color="action" />
                      <Typography variant="body2">
                        {formatarHora(agendamento.dataHoraInicio)} - {formatarHora(agendamento.dataHoraFim)}
                      </Typography>
                    </Box>
                  </Stack>

                  {/* Tipo de Atendimento */}
                  {agendamento.tipoAtendimento && (
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      <strong>Tipo:</strong> {agendamento.tipoAtendimento}
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
                {agendamento.status === 'AGENDADO' && (
                  <Box sx={{ p: 2, pt: 0 }}>
                    <Button
                      fullWidth
                      variant="contained"
                      color="success"
                      onClick={() => atualizarStatus(agendamento.id, 'CONFIRMADO')}
                    >
                      Confirmar Agendamento
                    </Button>
                  </Box>
                )}

                {agendamento.status === 'CONFIRMADO' && (
                  <Box sx={{ p: 2, pt: 0 }}>
                    <Stack spacing={1}>
                      <Button
                        fullWidth
                        variant="contained"
                        color="warning"
                        onClick={() => atualizarStatus(agendamento.id, 'EM_ANDAMENTO')}
                      >
                        Iniciar Atendimento
                      </Button>
                    </Stack>
                  </Box>
                )}

                {agendamento.status === 'EM_ANDAMENTO' && (
                  <Box sx={{ p: 2, pt: 0 }}>
                    <Button
                      fullWidth
                      variant="contained"
                      color="primary"
                      onClick={() => atualizarStatus(agendamento.id, 'CONCLUIDO')}
                    >
                      Concluir Atendimento
                    </Button>
                  </Box>
                )}
              </Card>
          ))}
        </Box>
      )}
    </Box>
  );
}
