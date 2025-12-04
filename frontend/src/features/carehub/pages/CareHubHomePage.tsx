import { Box, Typography, Paper, Container, Alert, Button, Card, CardContent, Stack, Chip } from '@mui/material';
import '../components/carehub-accessibility.css';
import { CareHubModuleGrid } from '../components/CareHubModuleGrid';
import { Favorite, CheckCircle, Cancel } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import { initializeAuthToken, getUser, getUserRole, isCliente, getUserId, checkAndCacheUserType } from '../components/auth';
import http from '../libHttp';
import dayjs from 'dayjs';

export default function CareHubHomePage() {
  const [_authStatus, setAuthStatus] = useState<'checking' | 'authenticated' | 'unauthenticated'>('checking');
  const [userInfo, setUserInfo] = useState<any>(null);
  const [repropostas, setRepropostas] = useState<any[]>([]);
  const [_isUserCliente, setIsUserCliente] = useState<boolean>(false);
  const userId = getUserId();

  useEffect(() => {
    // Inicializar token JWT no interceptor quando o CareHub for carregado
    initializeAuthToken();

    const inicializar = async () => {
      // Verificar tipo de usuário (cuidador/cliente) via API
      await checkAndCacheUserType();
      const ehCliente = isCliente();
      setIsUserCliente(ehCliente);

      // Verificar status da autenticação
      const user = getUser();
      const role = getUserRole();

      if (user && role) {
        setAuthStatus('authenticated');
        setUserInfo({ ...user, role });
      } else {
        setAuthStatus('unauthenticated');
      }

      // Carregar repropostas pendentes se for cliente
      if (userId && ehCliente) {
        carregarRepropostas();
      }
    };
    
    inicializar();
  }, []);

  const carregarRepropostas = async () => {
    try {
      const response = await http.get(`/api/carehub/agendamentos/cliente/${userId}`);
      const agendamentosReagendados = response.data.filter(
        (ag: any) => ag.status === 'REAGENDADO' && ag.proposedDataHoraInicio
      );
      setRepropostas(agendamentosReagendados);
    } catch {
      // Silenciosamente ignora erro - usuário pode não ter agendamentos ou não ser cliente cadastrado
      setRepropostas([]);
    }
  };

  const aceitarReproposta = async (agendamentoId: number) => {
    try {
      await http.post(`/api/carehub/agendamentos/${agendamentoId}/aceitar-contraproposta`);
      alert('Nova data confirmada com sucesso!');
      carregarRepropostas();
    } catch (error: any) {
      alert(error?.response?.data?.message || 'Erro ao aceitar nova data');
    }
  };

  const recusarReproposta = async (agendamentoId: number) => {
    try {
      await http.put(`/api/carehub/agendamentos/${agendamentoId}/status?status=CANCELADO`);
      alert('Agendamento cancelado.');
      carregarRepropostas();
    } catch (error) {
      alert('Erro ao recusar reproposta');
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 2 }}>
      <Paper
        elevation={0}
        sx={{
          p: 5,
          mb: 4,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          borderRadius: 4,
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 12px 40px rgba(102, 126, 234, 0.3)'
        }}
      >
        {/* Decoração de fundo */}
        <Box
          sx={{
            position: 'absolute',
            top: -100,
            right: -100,
            width: 300,
            height: 300,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.1)',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: -80,
            left: -80,
            width: 250,
            height: 250,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.05)',
          }}
        />

        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 3 }}>
            <Box
              sx={{
                bgcolor: 'rgba(255,255,255,0.2)',
                borderRadius: 3,
                p: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backdropFilter: 'blur(10px)'
              }}
            >
              <Favorite sx={{ fontSize: 56, filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))' }} />
            </Box>
            <Box>
              <Typography
                variant="h1"
                sx={{
                  color: 'white',
                  fontSize: { xs: '2rem', md: '3rem' },
                  fontWeight: 'bold',
                  mb: 1,
                  textShadow: '0 2px 4px rgba(0,0,0,0.2)'
                }}
              >
                {userInfo ? `Olá, ${userInfo.name}!` : 'Bem-vindo ao CareHub'}
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  color: 'rgba(255,255,255,0.95)',
                  fontWeight: 'medium'
                }}
              >
                Sistema de Acompanhamento de Idosos
              </Typography>
            </Box>
          </Box>
          <Typography
            variant="body1"
            sx={{
              color: 'rgba(255,255,255,0.9)',
              fontSize: '1.1rem',
              maxWidth: '600px',
              lineHeight: 1.6
            }}
          >
            Conectando cuidadores profissionais e famílias com cuidado, segurança e dedicação.
            Escolha o serviço que você precisa abaixo.
          </Typography>
        </Box>
      </Paper>

      {/* Notificações de Repropostas de Data */}
      {repropostas.length > 0 && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            📅 Você tem {repropostas.length} proposta(s) de nova data de atendimento
          </Typography>
          <Typography variant="body2" gutterBottom>
            O cuidador propôs uma nova data. Revise e confirme abaixo:
          </Typography>
          
          <Stack spacing={2} sx={{ mt: 2 }}>
            {repropostas.map((ag) => (
              <Card key={ag.id} variant="outlined">
                <CardContent>
                  <Stack direction="row" justifyContent="space-between" alignItems="flex-start" flexWrap="wrap" gap={2}>
                    <Box>
                      <Typography variant="subtitle1" fontWeight={600}>
                        Cuidador: {ag.cuidadorNome}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ textDecoration: 'line-through' }}>
                        Data Original: {dayjs(ag.dataHoraInicio).format('DD/MM/YYYY HH:mm')} - {dayjs(ag.dataHoraFim).format('HH:mm')}
                      </Typography>
                      <Typography variant="body1" fontWeight={600} color="primary" sx={{ mt: 1 }}>
                        Nova Data Proposta: {dayjs(ag.proposedDataHoraInicio).format('DD/MM/YYYY HH:mm')} - {dayjs(ag.proposedDataHoraFim).format('HH:mm')}
                      </Typography>
                      {ag.tipoAtendimento && (
                        <Chip label={ag.tipoAtendimento} size="small" sx={{ mt: 1 }} />
                      )}
                    </Box>
                    
                    <Stack direction="row" gap={1}>
                      <Button
                        variant="contained"
                        color="success"
                        size="small"
                        startIcon={<CheckCircle />}
                        onClick={() => aceitarReproposta(ag.id)}
                      >
                        Confirmar
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        startIcon={<Cancel />}
                        onClick={() => recusarReproposta(ag.id)}
                      >
                        Recusar
                      </Button>
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
            ))}
          </Stack>
        </Alert>
      )}

      <CareHubModuleGrid />
    </Container>
  );
}
