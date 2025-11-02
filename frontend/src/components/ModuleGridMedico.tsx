import { Box } from '@mui/material';
import { ModuleCard } from './ModuleCard';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import { useNavigate } from 'react-router-dom';

export function ModuleGridMedico({ paciente }: { paciente: string }) {
  const navigate = useNavigate();

  const items = [
    {
      icon: <LocalHospitalIcon sx={{ fontSize: 40 }} color="error" />,
      title: 'Receituário',
      desc: 'Registre informações de consultas e prescrições.',
      to: '/atendimento/receituario',
    },
    // Futuramente você pode adicionar outros módulos do médico aqui
  ];

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          sm: '1fr',
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
          onClick={() =>
            navigate(m.to, { state: { paciente } }) // Passa o paciente selecionado
          }
        />
      ))}
    </Box>
  );
}
