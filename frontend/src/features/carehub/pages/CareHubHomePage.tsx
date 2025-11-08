import { Box, Typography, Paper } from '@mui/material';
import { CareHubModuleGrid } from '../components/CareHubModuleGrid';
import { Favorite } from '@mui/icons-material';

export default function CareHubHomePage() {
  return (
    <Box>
      <Paper
        elevation={3}
        sx={{
          p: 3,
          mb: 4,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Favorite sx={{ fontSize: 48 }} />
          <Box>
            <Typography variant="h1" sx={{ color: 'white', fontSize: '2rem' }}>
              CareHub
            </Typography>
            <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.9)' }}>
              Sistema de Acompanhamento de Idosos
            </Typography>
          </Box>
        </Box>
        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
          Conectando cuidadores profissionais e famílias com cuidado e segurança
        </Typography>
      </Paper>

      <CareHubModuleGrid />
    </Box>
  );
}
