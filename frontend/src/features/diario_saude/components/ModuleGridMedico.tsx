import { Box } from '@mui/material';
import { ModuleCard } from '../../../components/ModuleCard';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import DescriptionIcon from '@mui/icons-material/Description';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import { useNavigate } from 'react-router-dom';

type Paciente = {
  id_usuario: number;
  nome: string;
  idade: number;
  peso: number;
  altura: number;
  alergias?: string;
};

export function ModuleGridMedico({ paciente, prescricao }: { paciente: Paciente, prescricao: any }) {
  const navigate = useNavigate();

  const items = [
    {
      icon: <LocalHospitalIcon sx={{ fontSize: 40 }} color="error" />,
      title: 'Receituário',
      desc: 'Adicionar medicamentos para o paciente.',
      onClick: () => navigate('/atendimento/receituario', { state: { paciente, prescricao } }),
    },
    {
      icon: <DescriptionIcon sx={{ fontSize: 40 }} color="primary" />,
      title: 'Pedir Exames',
      desc: 'Solicitar exames para o paciente.',
      onClick: () => navigate('/atendimento/exames', { state: { paciente, prescricao } }),
    },
    {
      icon: <FitnessCenterIcon sx={{ fontSize: 40 }} color="secondary" />,
      title: 'Recomendação de Exercícios',
      desc: 'Sugira exercícios para o paciente.',
      onClick: () => navigate('/atendimento/exercicios', { state: { paciente, prescricao } }),
    },
    {
      icon: <LocalHospitalIcon sx={{ fontSize: 40 }} color="success" />,
      title: 'Diagnosticar Doenças',
      desc: 'Selecionar doenças para o paciente.',
      onClick: () => navigate('/atendimento/doencas', { state: { paciente, prescricao } }),
    },

    {
      icon: <LocalHospitalIcon sx={{ fontSize: 40 }} color="warning" />,
      title: 'Alergias',
      desc: 'Visualizar e editar alergias do paciente.',
      onClick: () => navigate('/atendimento/alergias', { state: { paciente, prescricao } }),
    },
    
    {
      icon: <DescriptionIcon sx={{ fontSize: 40 }} color="info" />,
      title: 'Histórico de Consultas',
      desc: 'Ver todas as consultas do paciente.',
      onClick: () => navigate('/atendimento/historico-medico', { state: { paciente } }),
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
