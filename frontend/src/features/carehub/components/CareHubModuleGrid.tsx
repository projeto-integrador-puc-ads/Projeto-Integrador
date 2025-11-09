import { Box, Badge } from '@mui/material';
import { ModuleCard } from '@/components/ModuleCard';
import {
  Search,
  Chat,
  Event,
  CalendarMonth,
  LocalHospital,
  Assignment,
  AccessTime,
  History,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useMensagensNaoLidas } from '../hooks/useMensagensNaoLidas';
import { getUserId, getUserRole } from '@/lib/auth';

export function CareHubModuleGrid() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<number | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const { data: naoLidas = 0 } = useMensagensNaoLidas(userId || 0);

  useEffect(() => {
    const id = getUserId();
    const role = getUserRole();
    setUserId(id);
    setUserRole(role);
    
    console.log(`🎭 CareHub: User ID=${id}, Role=${role}`);
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
      icon: <History sx={{ fontSize: 40 }} />,
      title: 'Histórico de Atendimentos',
      desc: 'Veja todos os registros de atendimentos',
      to: '/carehub/historico-atendimentos',
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
      icon: <History sx={{ fontSize: 40 }} />,
      title: 'Histórico de Atendimentos',
      desc: 'Veja todos os registros por cliente',
      to: '/carehub/historico-atendimentos',
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

  // Seleciona módulos baseado no ROLE (aceita CUIDADOR ou ROLE_CUIDADOR)
  const modules = userRole?.includes('CUIDADOR') ? cuidadorModules : clienteModules;

  return (
    <Box>
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
