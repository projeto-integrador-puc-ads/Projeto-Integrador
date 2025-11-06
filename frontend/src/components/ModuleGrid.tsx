import { Box } from '@mui/material';
import { ModuleCard } from './ModuleCard';
import MedicationIcon from '@mui/icons-material/Medication';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import HistoryIcon from '@mui/icons-material/History';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import EscalatorWarningIcon from '@mui/icons-material/EscalatorWarning';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital'; // ✅ Novo ícone
import { useNavigate } from 'react-router-dom';

export function ModuleGrid() {
  const navigate = useNavigate();

  const items = [
    {
      icon: <MedicationIcon sx={{ fontSize: 40 }} />,
      title: 'Medicamentos',
      desc: 'Monitore horários e doses.',
      to: '/grupo1/medicamentos',
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

    // ✅ Novo módulo: Atendimento Médico
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
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          sm: '1fr 1fr',
          md: '1fr 1fr 1fr',
        },
        gap: 2,
        mt: 2,
      }}
    >
      {items.map((m) => (
        <ModuleCard
          key={m.title}
          icon={m.icon}
          title={m.title}
          description={m.desc}
          onClick={() => navigate(m.to)}
        />
      ))}
    </Box>
  );
}
