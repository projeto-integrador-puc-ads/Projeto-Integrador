import { AppBar, Avatar, Box, Container, Modal, Toolbar, Typography, Button } from '@mui/material';
import { deepPurple } from '@mui/material/colors';
import { Outlet, Link as RouterLink } from 'react-router-dom';
import { useState } from 'react';
import logo_unati_horizontal from '../assets/logo_unati_horizontal.png';

export default function AppLayout() {
  const [openProfile, setOpenProfile] = useState(false);

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
          <Box component={RouterLink as any} to="/home" sx={{ display: 'inline-flex', alignItems: 'center', mr: 2 }}>
            <Box
              component="img"
              src={logo_unati_horizontal}
              alt="Logo UNATI"
              sx={{ height: 48 }}
            />
          </Box>
          <Box sx={{ flex: 1 }} />

          {/* Botão Área do administrador */}
          <Button
            variant="outlined"
            color="primary"
            component={RouterLink as any}
            to="/admin"
            sx={{ mr: 2 }}
          >
            Área do administrador
          </Button>

          {/* Avatar no canto direito */}
          <Avatar
            sx={{
              bgcolor: deepPurple[500],
              cursor: 'pointer',
            }}
            onClick={() => setOpenProfile(true)}
          >
            M
          </Avatar>
        </Toolbar>
      </AppBar>

      {/* Espaçamento para compensar a AppBar fixa */}
      <Toolbar />

      {/* Conteúdo principal */}
      <Container sx={{ py: 3 }}>
        <Outlet />
      </Container>

      {/* Modal de Perfil */}
      <Modal open={openProfile} onClose={() => setOpenProfile(false)}>
        <Box
          onClick={(e) => e.stopPropagation()}
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'background.paper',
            p: 4,
            borderRadius: 3,
            boxShadow: 24,
            minWidth: 320,
            maxWidth: '90vw',
          }}
        >
          <Typography variant="h5" fontWeight={700} mb={2}>
            Meu Perfil
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Aqui você poderá visualizar e editar suas informações pessoais, como nome,
            e-mail e foto de perfil.
          </Typography>
          <Box
            component="button"
            onClick={() => setOpenProfile(false)}
            sx={{
              mt: 3,
              width: '100%',
              p: 1.2,
              bgcolor: 'primary.main',
              color: '#fff',
              border: 'none',
              borderRadius: 2,
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: 600,
            }}
          >
            Fechar
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}
