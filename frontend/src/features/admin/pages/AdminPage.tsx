import { Box, Container, Grid, Typography } from '@mui/material';
import AdminModuleCard from '../components/AdminModuleCard';
import GroupIcon from '@mui/icons-material/Group';

export default function AdminPage() {
  return (
    <Container sx={{ py: 3 }}>
      <Box mb={2}>
        <Typography variant="h2" gutterBottom>
          Area do Administrador
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Listagens e ações de gerenciamento
        </Typography>
      </Box>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={4}>
          <AdminModuleCard
            title="Usuarios"
            description="Gerenciar usuarios do sistema"
            to="/admin/usuarios"
            icon={<GroupIcon color="primary" fontSize="large" />}
          />
        </Grid>
      </Grid>
    </Container>
  );
}
