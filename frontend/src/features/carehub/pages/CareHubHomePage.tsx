import { Box, Typography, Paper, Container } from '@mui/material';
import { CareHubModuleGrid } from '../components/CareHubModuleGrid';
import { Favorite } from '@mui/icons-material';

export default function CareHubHomePage() {
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
