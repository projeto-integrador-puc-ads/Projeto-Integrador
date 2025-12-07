import { Box, Typography, Paper, Container, Alert, Button, Card, CardContent, Stack, Chip, Badge } from '@mui/material';
import '../components/carehub-accessibility.css';
import { CareHubModuleGrid } from '../components/CareHubModuleGrid';
import { Favorite, CheckCircle, Cancel, Star, RateReview } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import { initializeAuthToken, getUser, getUserRole, isCliente, getUserId, checkAndCacheUserType } from '../components/auth';
import http from '../libHttp';
import dayjs from 'dayjs';
import { agendamentosApi } from '../api';
import { AvaliacaoModal } from '../components/AvaliacaoModal';

export default function CareHubHomePage() {
  const [_authStatus, setAuthStatus] = useState<'checking' | 'authenticated' | 'unauthenticated'>('checking');
  const [userInfo, setUserInfo] = useState<any>(null);
  const [repropostas, setRepropostas] = useState<any[]>([]);
  const [isUserCliente, setIsUserCliente] = useState<boolean>(false);
  const [avaliacoesPendentes, setAvaliacoesPendentes] = useState<any[]>([]);
  const [avaliacaoModalOpen, setAvaliacaoModalOpen] = useState(false);
  const [selectedAgendamento, setSelectedAgendamento] = useState<any>(null);
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    // Inicializar token JWT no interceptor quando o CareHub for carregado
    initializeAuthToken();

    const inicializar = async () => {
      // Verificar tipo de usuário (cuidador/cliente) via API
      await checkAndCacheUserType();
      const ehCliente = isCliente();
      setIsUserCliente(ehCliente);
      
      // Obter userId após inicialização
      const currentUserId = getUserId();
      setUserId(currentUserId);

      // Verificar status da autenticação
      const user = getUser();
      const role = getUserRole();

      if (user && role) {
        setAuthStatus('authenticated');
        setUserInfo({ ...user, role });
      } else {
        setAuthStatus('unauthenticated');
      }
    };
    
    inicializar();
  }, []);

  // Carregar dados quando userId e tipo de usuário estiverem disponíveis
  useEffect(() => {
    if (userId && isUserCliente) {
      carregarRepropostas();
      carregarAvaliacoesPendentes();
    }
  }, [userId, isUserCliente]);

  const carregarAvaliacoesPendentes = async () => {
    try {
      const pendentes = await agendamentosApi.avaliacoesPendentes();
      setAvaliacoesPendentes(pendentes);
    } catch {
      // Silenciosamente ignora erro
      setAvaliacoesPendentes([]);
    }
  };

  const abrirAvaliacaoModal = (agendamento: any) => {
    setSelectedAgendamento(agendamento);
    setAvaliacaoModalOpen(true);
  };

  const fecharAvaliacaoModal = () => {
    setAvaliacaoModalOpen(false);
    setSelectedAgendamento(null);
    // Recarregar lista de avaliações pendentes após fechar modal
    carregarAvaliacoesPendentes();
  };

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
    <Container maxWidth="xl" sx={{ py: { xs: 1, sm: 2 }, px: { xs: 1, sm: 2, md: 3 } }}>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2.5, sm: 3, md: 5 },
          mb: { xs: 2, sm: 3, md: 4 },
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          borderRadius: { xs: 2, sm: 3, md: 4 },
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 12px 40px rgba(102, 126, 234, 0.3)'
        }}
      >
        {/* Decoração de fundo - esconder em telas pequenas */}
        <Box
          sx={{
            position: 'absolute',
            top: { xs: -60, md: -100 },
            right: { xs: -60, md: -100 },
            width: { xs: 150, sm: 200, md: 300 },
            height: { xs: 150, sm: 200, md: 300 },
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.1)',
            display: { xs: 'none', sm: 'block' }
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: { xs: -50, md: -80 },
            left: { xs: -50, md: -80 },
            width: { xs: 120, sm: 180, md: 250 },
            height: { xs: 120, sm: 180, md: 250 },
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.05)',
            display: { xs: 'none', sm: 'block' }
          }}
        />

        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'flex-start', sm: 'center' }, 
            gap: { xs: 2, sm: 2, md: 3 }, 
            mb: { xs: 2, md: 3 } 
          }}>
            <Box
              sx={{
                bgcolor: 'rgba(255,255,255,0.2)',
                borderRadius: { xs: 2, md: 3 },
                p: { xs: 1.5, md: 2 },
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backdropFilter: 'blur(10px)',
                flexShrink: 0
              }}
            >
              <Favorite sx={{ fontSize: { xs: 36, sm: 44, md: 56 }, filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))' }} />
            </Box>
            <Box sx={{ minWidth: 0, width: '100%' }}>
              <Typography
                variant="h1"
                sx={{
                  color: 'white',
                  fontSize: { xs: '1.4rem', sm: '1.75rem', md: '2.5rem', lg: '3rem' },
                  fontWeight: 'bold',
                  mb: 0.5,
                  textShadow: '0 2px 4px rgba(0,0,0,0.2)',
                  wordBreak: 'break-word',
                  lineHeight: 1.2
                }}
              >
                {userInfo ? `Olá, ${userInfo.name}!` : 'Bem-vindo ao CareHub'}
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  color: 'rgba(255,255,255,0.95)',
                  fontWeight: 'medium',
                  fontSize: { xs: '0.9rem', sm: '1rem', md: '1.15rem' }
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
              fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
              maxWidth: '600px',
              lineHeight: 1.6,
              display: { xs: 'none', sm: 'block' }
            }}
          >
            Conectando cuidadores profissionais e famílias com cuidado, segurança e dedicação.
            Escolha o serviço que você precisa abaixo.
          </Typography>
        </Box>
      </Paper>

      {/* Notificações de Repropostas de Data */}
      {repropostas.length > 0 && (
        <Alert severity="warning" sx={{ mb: { xs: 2, md: 3 }, '& .MuiAlert-message': { width: '100%' } }}>
          <Typography variant="h6" gutterBottom sx={{ fontSize: { xs: '1rem', sm: '1.15rem', md: '1.25rem' } }}>
            📅 Você tem {repropostas.length} proposta(s) de nova data
          </Typography>
          <Typography variant="body2" gutterBottom sx={{ display: { xs: 'none', sm: 'block' } }}>
            O cuidador propôs uma nova data. Revise e confirme abaixo:
          </Typography>
          
          <Stack spacing={2} sx={{ mt: 2 }}>
            {repropostas.map((ag) => (
              <Card key={ag.id} variant="outlined">
                <CardContent sx={{ p: { xs: 1.5, sm: 2 }, '&:last-child': { pb: { xs: 1.5, sm: 2 } } }}>
                  <Stack 
                    direction={{ xs: 'column', sm: 'row' }} 
                    justifyContent="space-between" 
                    alignItems={{ xs: 'stretch', sm: 'flex-start' }} 
                    gap={2}
                  >
                    <Box sx={{ minWidth: 0 }}>
                      <Typography variant="subtitle1" fontWeight={600} sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                        Cuidador: {ag.cuidadorNome}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ textDecoration: 'line-through', fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
                        Original: {dayjs(ag.dataHoraInicio).format('DD/MM HH:mm')}
                      </Typography>
                      <Typography variant="body1" fontWeight={600} color="primary" sx={{ mt: 1, fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                        Nova: {dayjs(ag.proposedDataHoraInicio).format('DD/MM HH:mm')}
                      </Typography>
                      {ag.tipoAtendimento && (
                        <Chip label={ag.tipoAtendimento} size="small" sx={{ mt: 1 }} />
                      )}
                    </Box>
                    
                    <Stack direction="row" gap={1} sx={{ flexShrink: 0, justifyContent: { xs: 'flex-end', sm: 'flex-start' } }}>
                      <Button
                        variant="contained"
                        color="success"
                        size="small"
                        startIcon={<CheckCircle />}
                        onClick={() => aceitarReproposta(ag.id)}
                        sx={{ fontSize: { xs: '0.75rem', sm: '0.8125rem' } }}
                      >
                        Confirmar
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        startIcon={<Cancel />}
                        onClick={() => recusarReproposta(ag.id)}
                        sx={{ fontSize: { xs: '0.75rem', sm: '0.8125rem' } }}
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

      {/* 🌟 Notificações de Avaliação Pendente - Estilo Uber/99 */}
      {avaliacoesPendentes.length > 0 && (
        <Alert 
          severity="info" 
          icon={<Badge badgeContent={avaliacoesPendentes.length} color="error"><RateReview /></Badge>}
          sx={{ 
            mb: { xs: 2, md: 3 }, 
            '& .MuiAlert-message': { width: '100%' },
            background: 'linear-gradient(135deg, #fff8e1 0%, #ffecb3 100%)',
            border: '2px solid #ffc107',
          }}
        >
          <Typography variant="h6" gutterBottom sx={{ fontSize: { xs: '1rem', sm: '1.15rem', md: '1.25rem' }, display: 'flex', alignItems: 'center', gap: 1 }}>
            <Star sx={{ color: '#ffc107' }} />
            Como foi seu atendimento?
          </Typography>
          <Typography variant="body2" gutterBottom color="text.secondary">
            Você tem {avaliacoesPendentes.length} atendimento(s) concluído(s) aguardando sua avaliação. Sua opinião ajuda outros clientes!
          </Typography>
          
          <Stack spacing={2} sx={{ mt: 2 }}>
            {avaliacoesPendentes.slice(0, 3).map((ag) => (
              <Card 
                key={ag.id} 
                variant="outlined"
                sx={{ 
                  transition: 'all 0.2s ease',
                  '&:hover': { 
                    boxShadow: 3,
                    borderColor: '#ffc107',
                  }
                }}
              >
                <CardContent sx={{ p: { xs: 1.5, sm: 2 }, '&:last-child': { pb: { xs: 1.5, sm: 2 } } }}>
                  <Stack 
                    direction={{ xs: 'column', sm: 'row' }} 
                    justifyContent="space-between" 
                    alignItems={{ xs: 'stretch', sm: 'center' }} 
                    gap={2}
                  >
                    <Box sx={{ minWidth: 0 }}>
                      <Typography variant="subtitle1" fontWeight={600} sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                        {ag.cuidadorNome}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
                        Concluído em {dayjs(ag.dataHoraFim).format('DD/MM/YYYY [às] HH:mm')}
                      </Typography>
                      {ag.tipoAtendimento && (
                        <Chip 
                          label={ag.tipoAtendimento.replace('_', ' ')} 
                          size="small" 
                          sx={{ mt: 1 }} 
                          color="primary"
                          variant="outlined"
                        />
                      )}
                    </Box>
                    
                    <Button
                      variant="contained"
                      size="medium"
                      startIcon={<Star />}
                      onClick={() => abrirAvaliacaoModal(ag)}
                      sx={{ 
                        background: 'linear-gradient(135deg, #ffc107 0%, #ffb300 100%)',
                        color: '#000',
                        fontWeight: 600,
                        '&:hover': {
                          background: 'linear-gradient(135deg, #ffb300 0%, #ffa000 100%)',
                        },
                        minWidth: { xs: '100%', sm: 'auto' }
                      }}
                    >
                      Avaliar agora
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            ))}
            
            {avaliacoesPendentes.length > 3 && (
              <Typography variant="body2" color="text.secondary" textAlign="center">
                + {avaliacoesPendentes.length - 3} mais avaliação(ões) pendente(s)
              </Typography>
            )}
          </Stack>
        </Alert>
      )}

      <CareHubModuleGrid />

      {/* Modal de Avaliação */}
      {selectedAgendamento && (
        <AvaliacaoModal
          open={avaliacaoModalOpen}
          onClose={fecharAvaliacaoModal}
          cuidadorId={selectedAgendamento.cuidadorId}
          cuidadorNome={selectedAgendamento.cuidadorNome}
          clienteId={userId || 0}
          initialAgendamentoId={selectedAgendamento.id}
        />
      )}
    </Container>
  );
}
