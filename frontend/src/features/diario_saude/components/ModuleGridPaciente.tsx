import { Box } from '@mui/material';
import { ModuleCard } from '../../../components/ModuleCard';
import HistoryIcon from '@mui/icons-material/History';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import CoronavirusIcon from '@mui/icons-material/Coronavirus';
import { useNavigate } from 'react-router-dom';

export function ModuleGridSaude() {
  const navigate = useNavigate();

  const items = [
    {
      icon: <HistoryIcon sx={{ fontSize: 40 }} color="primary" />,
      title: 'Histórico de Consultas',
      desc: 'Veja consultas anteriores.',
      onClick: () => navigate('/historico_consultas'),
    },
    {
      icon: <LocalHospitalIcon sx={{ fontSize: 40 }} color="error" />,
      title: 'Atendimento Médico',
      desc: 'Registrar avaliação médica.',
      onClick: () => navigate('/atendimento'),
    },
    {
      icon: <CoronavirusIcon sx={{ fontSize: 40 }} color="info" />,
      title: 'Informações de Saúde',
      desc: 'Doenças cadastradas do paciente.',
      onClick: () => navigate('/informacoes_saude'),
    },
  ];

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
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
          onClick={m.onClick}
        />
      ))}
    </Box>
  );
}
