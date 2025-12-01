import { Box, Badge } from '@mui/material';
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
import http from '../libHttp';
import { useMensagensNaoLidas } from '../hooks/useMensagensNaoLidas';
import { getUserId, isCuidador as isRoleCuidador } from './auth';

export function CareHubModuleGrid() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<number | null>(null);
  const [detectedCuidador, setDetectedCuidador] = useState<boolean | null>(null);
  const { data: naoLidas = 0 } = useMensagensNaoLidas(userId || 0);

  useEffect(() => {
    const id = getUserId();
    console.log('CareHub Debug - User ID:', id);
    console.log('CareHub Debug - Raw localStorage user:', localStorage.getItem('user'));
    setUserId(id);
    }, []);

  // Se a role não indicar explicitamente 'CUIDADOR', tentar validar consultando
  // o endpoint de cuidadores pelo userId (caso o token/localStorage venha como ROLE_USER)
  useEffect(() => {
    let mounted = true;
    async function detectCuidador() {
      // se já detectamos explicitamente via role, use isso
      if (isRoleCuidador()) {
        if (mounted) setDetectedCuidador(true);
        return;
      }

      if (!userId) {
        if (mounted) setDetectedCuidador(false);
        return;
      }

      try {
        // Primeiro tente consultar o usuário geral (mais robusto): /api/users/{id}
        // esse endpoint retorna o role do usuário e evita 400 quando o id
        // existe mas não é um cuidador.
        const resp = await http.get(`/api/users/${userId}`);
        const role = resp.data?.role?.name || resp.data?.role?.code || resp.data?.role?.roleName;
        const roleStr = role ? String(role).toUpperCase() : '';
        if (mounted && /CUIDADOR/.test(roleStr)) {
          setDetectedCuidador(true);
          return;
        }

        // Se /api/users não indicar cuidador, como fallback tentamos o
        // endpoint específico de cuidadores — se ele retornar 200, é cuidador.
        try {
          await http.get(`/api/carehub/cuidadores/${userId}`);
          if (mounted) setDetectedCuidador(true);
          return;
        } catch (innerErr) {
          // não é cuidador
          if (mounted) setDetectedCuidador(false);
          return;
        }
      } catch (err) {
        // Se a primeira chamada falhar (ex.: não autenticado), tentamos o
        // endpoint de cuidadores diretamente como última alternativa.
        try {
          await http.get(`/api/carehub/cuidadores/${userId}`);
          if (mounted) setDetectedCuidador(true);
        } catch (err2) {
          if (mounted) setDetectedCuidador(false);
        }
      }
    }

    detectCuidador();

    return () => { mounted = false; };
  }, [userId]);

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
  // Preferência: usar detecção via API quando disponível (covers ROLE_USER case)
  const isCuidadorFinal = detectedCuidador ?? isRoleCuidador();
  const modules = isCuidadorFinal ? cuidadorModules : clienteModules;

  // Se não tivermos userId, ainda renderizamos os módulos (baseado em role token/claims),
  // mas mostramos uma mensagem discreta para o ambiente de desenvolvimento.
  // Isso evita bloquear a UI se o usuário estiver autenticado via token mas o userId
  // não estiver presente no localStorage por alguma razão.
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
