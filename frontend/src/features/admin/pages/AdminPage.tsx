import { Box, Container, Grid, Typography } from '@mui/material';
import AdminModuleCard from '../components/AdminModuleCard';
import GroupIcon from '@mui/icons-material/Group';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';

export default function AdminPage() {
  return (
    <Container sx={{ py: 3 }}>
      <Box mb={2}>
        <Typography variant="h2" gutterBottom>
          Área do Administrador
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Listagens e ações de gerenciamento.
        </Typography>
      </Box>

      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <AdminModuleCard
            title="Usuários"
            description="Gerenciar usuários do sistema"
            to="/admin/usuarios"
            icon={<GroupIcon color="primary" fontSize="large" />}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <AdminModuleCard
            title="Médicos"
            description="Gerenciar profissionais de saúde"
            to="/admin/medicos"
            icon={<LocalHospitalIcon color="primary" fontSize="large" />}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <AdminModuleCard
            title="Cuidadores"
            description="Gerenciar cuidadores"
            to="/admin/cuidadores"
            icon={<VolunteerActivismIcon color="primary" fontSize="large" />}
          />
        </Grid>
      </Grid>
    </Container>
  );
}
