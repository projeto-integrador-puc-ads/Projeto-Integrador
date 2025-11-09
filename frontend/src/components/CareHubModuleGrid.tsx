import { Box, Typography, Divider, Badge } from '@mui/material';
import { ModuleCard } from './ModuleCard';
import {
  Search,
  Chat,
  Event,
  CalendarMonth,
  LocalHospital,
  Assignment,
  AccessTime,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useMensagensNaoLidas } from '../features/carehub/hooks/useMensagensNaoLidas';

export function CareHubModuleGrid() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<number>(2);
  const { data: naoLidas = 0 } = useMensagensNaoLidas(userId);

  useEffect(() => {
    const savedUserId = localStorage.getItem('userId');
    if (savedUserId) {
      setUserId(parseInt(savedUserId));
    }
  }, []);

  // Módulos do Cliente (Dona Maria - ID 2)
  const clienteModules = [
    {
      icon: <Search sx={{ fontSize: 40 }} />,
      title: 'Buscar Cuidadores',
      desc: 'Encontre cuidadores profissionais',
      to: '/carehub/cuidadores',
    },
    {
      icon: <AccessTime sx={{ fontSize: 40 }} />,
      title: 'Próximos Atendimentos',
      desc: 'Visualize agendamentos futuros',
      to: '/carehub/proximos',
    },
    {
      icon: <Event sx={{ fontSize: 40 }} />,
      title: 'Meus Agendamentos',
      desc: 'Gerencie seus agendamentos',
      to: '/carehub/agendamentos',
    },
    {
      icon: (
        <Badge badgeContent={naoLidas} color="error">
          <Chat sx={{ fontSize: 40 }} />
        </Badge>
      ),
      title: 'Mensagens',
      desc: 'Converse com cuidadores',
      to: '/carehub/chat',
    },
  ];

  // Módulos do Cuidador (João - ID 3)
  const cuidadorModules = [
    {
      icon: <AccessTime sx={{ fontSize: 40 }} />,
      title: 'Próximos Atendimentos',
      desc: 'Visualize agendamentos futuros',
      to: '/carehub/proximos',
    },
    {
      icon: <CalendarMonth sx={{ fontSize: 40 }} />,
      title: 'Meus Agendamentos',
      desc: 'Gerencie atendimentos agendados',
      to: '/carehub/cuidador/agendamentos',
    },
    {
      icon: <LocalHospital sx={{ fontSize: 40 }} />,
      title: 'Prontuários',
      desc: 'Acesse prontuários dos clientes',
      to: '/carehub/cuidador/prontuarios',
    },
    {
      icon: <Assignment sx={{ fontSize: 40 }} />,
      title: 'Registrar Atendimento',
      desc: 'Preencha relatórios de acompanhamento',
      to: '/carehub/cuidador/registros',
    },
    {
      icon: (
        <Badge badgeContent={naoLidas} color="error">
          <Chat sx={{ fontSize: 40 }} />
        </Badge>
      ),
      title: 'Mensagens',
      desc: 'Converse com clientes',
      to: '/carehub/chat',
    },
  ];

  const modules = userId === 3 ? cuidadorModules : clienteModules;
  const perfil = userId === 3 ? 'Cuidador Profissional' : 'Cliente';

  return (
    <Box>
      <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
        🎭 Você está como: <strong>{perfil}</strong>
      </Typography>
      <Divider sx={{ mb: 3 }} />
      
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: '1fr 1fr',
            md: '1fr 1fr 1fr',
          },
          gap: 2,
        }}
      >
        {modules.map((m) => (
          <ModuleCard
            key={m.title}
            icon={m.icon}
            title={m.title}
            description={m.desc}
            onClick={() => navigate(m.to)}
          />
        ))}
      </Box>
    </Box>
  );
}
