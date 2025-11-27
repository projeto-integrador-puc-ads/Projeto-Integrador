import { useQuery } from '@tanstack/react-query';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Alert,
  Chip,
  CircularProgress,
  Divider,
} from '@mui/material';
import {
  AccessTime,
  CalendarToday,
  Person,
  Event,
  CheckCircle,
  Schedule,
} from '@mui/icons-material';
import http from '../libHttp';
import { getUserId } from '../components/auth';

interface Agendamento {
  id: number;
  cuidadorId: number;
  cuidadorNome: string;
  clienteId: number;
  clienteNome: string;
  dataHoraInicio: string;
  dataHoraFim: string;
  status: string;
  observacoes?: string;
  tipoAtendimento?: string;
}

export function ProximosAtendimentosPage() {
  const userId = getUserId();
  
  const { data: agendamentos = [], isLoading, error } = useQuery<Agendamento[]>({
    queryKey: ['proximos-atendimentos', userId],
    queryFn: async () => {
      // Este endpoint usa Principal no backend (autenticação JWT).
      // Não enviar 'X-User-Id' aqui para manter comportamento de produção.
      const response = await http.get<Agendamento[]>('/api/carehub/agendamentos/proximos', {
        params: { dias: 7 },
      });
      return response.data;
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDENTE':
        return 'default';
      case 'CONFIRMADO':
        return 'info';
      case 'EM_ANDAMENTO':
        return 'primary';
      case 'CONCLUIDO':
        return 'success';
      case 'CANCELADO':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'CONFIRMADO':
        return <CheckCircle fontSize="small" />;
      case 'EM_ANDAMENTO':
        return <Schedule fontSize="small" />;
      default:
        return <Event fontSize="small" />;
    }
  };

  // Função para formatar data sem biblioteca externa
  const formatarData = (dataString: string) => {
    const data = new Date(dataString);
    const diasSemana = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    const meses = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 
                   'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
    
    const diaSemana = diasSemana[data.getDay()];
    const dia = data.getDate();
    const mes = meses[data.getMonth()];
    const horas = data.getHours().toString().padStart(2, '0');
    const minutos = data.getMinutes().toString().padStart(2, '0');
    
    return `${diaSemana}, ${dia} de ${mes} às ${horas}:${minutos}`;
  };

  const formatarDataCurta = (dataString: string) => {
    const data = new Date(dataString);
    const dia = data.getDate().toString().padStart(2, '0');
    const mes = (data.getMonth() + 1).toString().padStart(2, '0');
    const ano = data.getFullYear();
    const horas = data.getHours().toString().padStart(2, '0');
    const minutos = data.getMinutes().toString().padStart(2, '0');
    
    return `${dia}/${mes}/${ano} ${horas}:${minutos}`;
  };

  const getDiasRestantes = (dataString: string) => {
    const agora = new Date();
    const dataAgendamento = new Date(dataString);
    const diferencaMs = dataAgendamento.getTime() - agora.getTime();
    const diferencaDias = Math.ceil(diferencaMs / (1000 * 60 * 60 * 24));
    
    if (diferencaDias === 0) {
      return 'Hoje';
    } else if (diferencaDias === 1) {
      return 'Amanhã';
    } else {
      return `Em ${diferencaDias} dias`;
    }
  };

  if (isLoading) {
    return (
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="400px" gap={2}>
        <CircularProgress size={60} />
        <Typography variant="body1" color="text.secondary">
          Carregando próximos atendimentos...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Alert severity="error">
          <Typography variant="h6">Erro ao carregar atendimentos</Typography>
          <Typography variant="body2">
            Não foi possível carregar seus próximos atendimentos. Tente novamente mais tarde.
          </Typography>
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box display="flex" alignItems="center" gap={2} mb={3}>
        <AccessTime sx={{ fontSize: 40, color: 'primary.main' }} />
        <Box>
          <Typography variant="h4" fontWeight="bold">
            Próximos Atendimentos
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Seus agendamentos para os próximos dias
          </Typography>
        </Box>
      </Box>

      {agendamentos.length > 0 ? (
        <>
          <Alert severity="info" sx={{ mb: 3 }}>
            <strong>{agendamentos.length}</strong> atendimento(s) agendado(s) nos próximos 7 dias
          </Alert>

          <Box display="flex" flexDirection="column" gap={2}>
            {agendamentos.map((agendamento) => (
              <Card 
                key={agendamento.id}
                sx={{ 
                  borderLeft: 4, 
                  borderColor: 
                    agendamento.status === 'CONFIRMADO' ? 'info.main' :
                    agendamento.status === 'EM_ANDAMENTO' ? 'primary.main' :
                    'grey.400'
                }}
              >
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                    <Box>
                      <Typography variant="h6" gutterBottom>
                        <CalendarToday sx={{ verticalAlign: 'middle', mr: 1, fontSize: 20 }} />
                        {formatarData(agendamento.dataHoraInicio)}
                      </Typography>
                      <Chip 
                        icon={getStatusIcon(agendamento.status)}
                        label={getDiasRestantes(agendamento.dataHoraInicio)} 
                        color="warning" 
                        size="small" 
                        sx={{ mr: 1 }}
                      />
                      <Chip 
                        label={agendamento.status} 
                        color={getStatusColor(agendamento.status) as any}
                        size="small" 
                      />
                    </Box>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <Box display="grid" gridTemplateColumns={{ xs: '1fr', sm: '1fr 1fr' }} gap={2}>
                    <Box>
                      <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                        CUIDADOR
                      </Typography>
                      <Box display="flex" alignItems="center" gap={1}>
                        <Person fontSize="small" color="action" />
                        <Typography variant="body1" fontWeight="medium">
                          {agendamento.cuidadorNome}
                        </Typography>
                      </Box>
                    </Box>

                    <Box>
                      <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                        CLIENTE
                      </Typography>
                      <Box display="flex" alignItems="center" gap={1}>
                        <Person fontSize="small" color="action" />
                        <Typography variant="body1" fontWeight="medium">
                          {agendamento.clienteNome}
                        </Typography>
                      </Box>
                    </Box>

                    <Box>
                      <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                        HORÁRIO DE INÍCIO
                      </Typography>
                      <Typography variant="body2">
                        {formatarDataCurta(agendamento.dataHoraInicio)}
                      </Typography>
                    </Box>

                    <Box>
                      <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                        HORÁRIO DE TÉRMINO
                      </Typography>
                      <Typography variant="body2">
                        {formatarDataCurta(agendamento.dataHoraFim)}
                      </Typography>
                    </Box>

                    {agendamento.tipoAtendimento && (
                      <Box>
                        <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                          TIPO DE ATENDIMENTO
                        </Typography>
                        <Typography variant="body2">
                          {agendamento.tipoAtendimento}
                        </Typography>
                      </Box>
                    )}

                    {agendamento.observacoes && (
                      <Box gridColumn={{ sm: 'span 2' }}>
                        <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                          OBSERVAÇÕES
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {agendamento.observacoes}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        </>
      ) : (
        <Alert severity="info">
          <Typography variant="h6" gutterBottom>
            Nenhum atendimento agendado
          </Typography>
          <Typography variant="body2">
            Você não possui atendimentos agendados para os próximos 7 dias.
          </Typography>
        </Alert>
      )}
    </Box>
  );
}
