import { Box } from '@mui/material';
import { ModuleCard } from './ModuleCard';
import MedicationIcon from '@mui/icons-material/Medication';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import DescriptionIcon from '@mui/icons-material/Description'; // ícone para Pedir Exames
import { useNavigate } from 'react-router-dom';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';

export function ModuleGridMedico({ paciente }: { paciente: string }) {
  const navigate = useNavigate();

  const items = [
    {
      icon: <LocalHospitalIcon sx={{ fontSize: 40 }} color="error" />,
      title: 'Receituário',
      desc: 'Adicionar medicamentos para o paciente.',
      onClick: () => navigate('/atendimento/receituario', { state: { paciente } }),
    },
    {
      icon: <DescriptionIcon sx={{ fontSize: 40 }} color="primary" />,
      title: 'Pedir Exames',
      desc: 'Solicitar exames para o paciente.',
      onClick: () => navigate('/atendimento/exames', { state: { paciente } }),
    },
    {
      icon: <FitnessCenterIcon sx={{ fontSize: 40 }} color="secondary" />,
      title: 'Recomendação de Exercícios',
      desc: 'Sugira exercícios para o paciente.',
      onClick: () => navigate('/atendimento/exercicios', { state: { paciente } }),
    },
  ];

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          sm: '1fr 1fr',
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
          onClick={m.onClick}
        />
      ))}
    </Box>
  );
}
