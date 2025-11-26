import { Box, Badge, Typography } from '@mui/material';
import { AccessibleModuleCard } from './AccessibleModuleCard';
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
import { getUserId, getUserRole } from './auth';

export function CareHubModuleGrid() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<number | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const { data: naoLidas = 0 } = useMensagensNaoLidas(userId || 0);

  useEffect(() => {
    const id = getUserId();
    const role = getUserRole();
    console.log('CareHub Debug - User ID:', id);
    console.log('CareHub Debug - User Role:', role);
    console.log('CareHub Debug - Raw localStorage user:', localStorage.getItem('user'));
    setUserId(id);
    setUserRole(role);
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
      to: '/carehub/cuidador/registro',
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

  // Seleciona módulos baseado no ROLE (aceita CUIDADOR, CAREHUB_CUIDADOR, etc.)
  const isCuidador = userRole?.includes('CUIDADOR') || userRole?.includes('CAREHUB_CUIDADOR');
  const modules = isCuidador ? cuidadorModules : clienteModules;

  // Debug info
  if (!userId || !userRole) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6" color="error">
          Erro: Usuário não autenticado
        </Typography>
        <Typography variant="body2" sx={{ mt: 2 }}>
          User ID: {userId || 'null'}
        </Typography>
        <Typography variant="body2">
          User Role: {userRole || 'null'}
        </Typography>
        <Typography variant="body2" sx={{ mt: 2, fontSize: '0.8rem', color: 'text.secondary' }}>
          Verifique se você está logado e se os dados estão no localStorage.
        </Typography>
      </Box>
    );
  }

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
          <AccessibleModuleCard
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
