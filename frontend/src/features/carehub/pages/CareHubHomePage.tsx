import { Box, Typography, Paper, Container, Alert, Button } from '@mui/material';
import '../components/carehub-accessibility.css';
import { CareHubModuleGrid } from '../components/CareHubModuleGrid';
import { Favorite } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import { initializeAuthToken, getUser, getUserRole, debugAuthStorage, setTokenManually } from '../components/auth';

export default function CareHubHomePage() {
  console.log('CareHubHomePage rendered');

  const [authStatus, setAuthStatus] = useState<'checking' | 'authenticated' | 'unauthenticated'>('checking');
  const [userInfo, setUserInfo] = useState<any>(null);
  const [debugInfo, setDebugInfo] = useState<any>(null);

  useEffect(() => {
    // Debug: verificar o que está no localStorage
    const debugData = debugAuthStorage();
    setDebugInfo(debugData);

    // Inicializar token JWT no interceptor quando o CareHub for carregado
    initializeAuthToken();

    // Verificar status da autenticação
    const user = getUser();
    const role = getUserRole();

    if (user && role) {
      setAuthStatus('authenticated');
      setUserInfo({ ...user, role });
    } else {
      setAuthStatus('unauthenticated');
    }
  }, []);

  const handleManualTokenSetup = () => {
    // Tentar configurar token manualmente se houver algum no localStorage
    const token = localStorage.getItem('token') || localStorage.getItem('accessToken');
    if (token) {
      setTokenManually(token);
      alert('Token configurado manualmente. Recarregue a página.');
    } else {
      alert('Nenhum token encontrado no localStorage. Faça login novamente.');
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 2 }}>
      {/* Debug Info - Remover depois de testar */}
      {authStatus === 'unauthenticated' && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          <Typography variant="body2" sx={{ mb: 1 }}>
            <strong>Debug Info:</strong> Usuário não autenticado. Verifique se fez login corretamente.
          </Typography>
          {debugInfo && (
            <Box sx={{ mt: 1, fontSize: '0.8rem', fontFamily: 'monospace' }}>
              <div>Token: {debugInfo.token ? 'Encontrado' : 'Não encontrado'}</div>
              <div>User: {debugInfo.user ? 'Encontrado' : 'Não encontrado'}</div>
              <Button
                size="small"
                onClick={handleManualTokenSetup}
                sx={{ mt: 1, mr: 1 }}
                variant="outlined"
              >
                Tentar configurar token
              </Button>
              <Button
                size="small"
                onClick={() => window.open('/carehub/debug', '_blank')}
                sx={{ mt: 1 }}
                variant="outlined"
              >
                Página de Debug
              </Button>
            </Box>
          )}
        </Alert>
      )}

      {authStatus === 'authenticated' && userInfo && (
        <Alert severity="success" sx={{ mb: 2 }}>
          <Typography variant="body2">
            <strong>✅ Autenticado:</strong> {userInfo.name} ({userInfo.role})
          </Typography>
        </Alert>
      )}

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
                Bem-vindo ao CareHub
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

      <CareHubModuleGrid />
    </Container>
  );
}
