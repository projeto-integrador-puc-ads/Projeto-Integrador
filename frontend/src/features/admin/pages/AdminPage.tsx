import { Box, Container, Grid, Typography } from '@mui/material';
import GroupIcon from '@mui/icons-material/Group';
import SecurityIcon from '@mui/icons-material/Security';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import AdminModuleCard from '../components/AdminModuleCard';

export default function AdminPage() {
  return (
      <Container sx={{ py: 3 }}>
        <Box mb={2}>
          <Typography variant="h2" gutterBottom>
            Área do Administrador
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Listagens e ações de gerenciamento
          </Typography>
        </Box>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={4} md={4}>
            <AdminModuleCard
                title="Usuários"
                description="Gerenciar usuários"
                to="/admin/usuarios"
                icon={<GroupIcon color="primary" fontSize="large" />}
            />
          </Grid>
          <Grid item xs={12} sm={4} md={4}>
            <AdminModuleCard
                title="Permissões"
                description="Listar permissões"
                to="/admin/permissoes"
                icon={<SecurityIcon color="primary" fontSize="large" />}
            />
          </Grid>
          <Grid item xs={12} sm={4} md={4}>
            <AdminModuleCard
                title="Conquistas"
                description="Gerenciar conquistas"
                to="/admin/conquistas"
                icon={<EmojiEventsIcon color="primary" fontSize="large" />}
            />
          </Grid>
        </Grid>
      </Container>
  );
}