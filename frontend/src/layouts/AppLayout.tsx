import { AppBar, Box, Container, Fab, Toolbar, Typography } from '@mui/material';
import LoginIcon from '@mui/icons-material/Login';
import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import { setAuthToken } from '@/lib/http';
import logo_unati_horizontal from '../assets/logo_unati_horizontal.png';

function LoginDialogMock({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;

  return (
    <Box
      sx={{
        position: 'fixed',
        inset: 0,
        bgcolor: 'rgba(0,0,0,0.4)',
        display: 'grid',
        placeItems: 'center',
        zIndex: 9999,
      }}
      onClick={onClose}
    >
      <Box
        onClick={(e) => e.stopPropagation()}
        sx={{
          bgcolor: 'background.paper',
          p: 3,
          borderRadius: 2,
          minWidth: 320,
          boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
        }}
      >
        <Typography variant="h2" gutterBottom>
          Entrar
        </Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          Este é um login de exemplo (mock). Clique em "Confirmar" para simular autenticação.
        </Typography>

        <Box
          component="button"
          onClick={() => {
            setAuthToken('token-demo');
            onClose();
          }}
          sx={{
            mt: 2,
            p: 1.5,
            borderRadius: 2,
            border: 'none',
            bgcolor: 'primary.main',
            color: '#fff',
            cursor: 'pointer',
            fontSize: '1.0625rem',
            fontWeight: 700,
            width: '100%',
          }}
        >
          Confirmar
        </Box>
      </Box>
    </Box>
  );
}

export default function AppLayout() {
  const [open, setOpen] = useState(false);

  return (
    <Box sx={{ minHeight: '100dvh', bgcolor: 'background.default' }}>
      {/* Top App Bar fixa */}
      <AppBar
        position="fixed"
        elevation={0}
        color="transparent"
        sx={{
          borderBottom: '1px solid #e5eaf2',
          backdropFilter: 'blur(8px)',
          bgcolor: 'rgba(255,255,255,0.85)',
        }}
      >
        <Toolbar>
          {/* Logo UNATI */}
          <Box
            component="img"
            src={logo_unati_horizontal}
            alt="Logo UNATI"
            sx={{
              height: 48,
              mr: 2,
            }}
          />
          <Typography variant="h2" sx={{ flex: 1 }}>
            UNATI
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Espaçamento para compensar a AppBar fixa */}
      <Toolbar />

      {/* Conteúdo principal */}
      <Container sx={{ py: 3 }}>
        <Outlet />
      </Container>

      {/* Botão flutuante de login */}
      <Fab
        color="primary"
        aria-label="Fazer login"
        onClick={() => setOpen(true)}
        sx={{ position: 'fixed', right: 24, bottom: 24 }}
      >
        <LoginIcon />
      </Fab>

      {/* Mock Login Dialog */}
      <LoginDialogMock open={open} onClose={() => setOpen(false)} />
    </Box>
  );
}
