import React from 'react';
import { Box, Grid, Typography } from '@mui/material';
import { ModuleCard } from './ModuleCard';
import { useNavigate } from 'react-router-dom';

// Ícones do Material-UI
import MedicationIcon from '@mui/icons-material/Medication';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import HistoryIcon from '@mui/icons-material/History';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import EscalatorWarningIcon from '@mui/icons-material/EscalatorWarning';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import FavoriteIcon from '@mui/icons-material/Favorite';

export function ModuleGrid() {
  const navigate = useNavigate(); // para navegação

  const items = [
    {
      icon: <FavoriteIcon sx={{ fontSize: 40 }} />,
      title: 'CareHub',
      desc: 'Cuidadores, agendamentos, prontuários e chat.',
      to: '/carehub',
    },
    {
      icon: <MedicationIcon sx={{ fontSize: 40 }} />,
      title: 'Medicamentos',
      desc: 'Monitore horários e doses.',
      to: '/medicamentos',
    },
    {
      icon: <SportsEsportsIcon sx={{ fontSize: 40 }} />,
      title: 'Jogos Interativos',
      desc: 'Exercícios de memória e atenção.',
      to: '/grupo2/jogos',
    },
    {
      icon: <ShoppingCartIcon sx={{ fontSize: 40 }} />,
      title: 'Lista de Compras',
      desc: 'Organize compras do mês.',
      to: '/grupo3/compras',
    },
    {
      icon: <HistoryIcon sx={{ fontSize: 40 }} />,
      title: 'Histórico de Consultas',
      desc: 'Acompanhe suas consultas médicas.',
      to: '/grupo4/consultas',
    },
    {
      icon: <LocalHospitalIcon sx={{ fontSize: 40 }} color="error" />,
      title: 'Atendimento Médico',
      desc: 'Registre informações de consultas e diagnósticos.',
      to: '/atendimento',
    },
    {
      icon: <EscalatorWarningIcon sx={{ fontSize: 40 }} />,
      title: 'Ajudador',
      desc: 'Dicas rápidas e ajuda no dia a dia.',
      to: '/grupo5/ajudador',
    },
    {
      icon: <HelpOutlineIcon sx={{ fontSize: 40 }} />,
      title: 'Dúvidas',
      desc: 'Dúvidas e sugestões.',
      to: '/grupo6/ajudador',
    },
  ];

  return (
    <Box sx={{ flexGrow: 1, mt: 4 }}>
      <Typography variant="h6" gutterBottom sx={{ textAlign: 'center', color: 'primary.main' }}>
        Escolha um módulo para começar
      </Typography>
      <Grid container spacing={3} justifyContent="center">
        {items.map((m) => (
          <Grid item key={m.title} xs={12} sm={6} md={4}>
            <ModuleCard
              icon={m.icon}
              title={m.title}
              description={m.desc}
              onClick={() => navigate(m.to)} //Passando a função onClick para o SEU ModuleCard
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
