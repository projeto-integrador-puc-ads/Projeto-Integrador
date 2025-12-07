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
import { useMensagensNaoLidas } from '../hooks/useMensagensNaoLidas';
import { getUserId, isCuidador as isRoleCuidador } from './auth';
import { agendamentosApi } from '../api';

export function CareHubModuleGrid() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<number | null>(null);
  const [detectedCuidador, setDetectedCuidador] = useState<boolean | null>(null);
  const { data: naoLidas = 0 } = useMensagensNaoLidas(userId || 0);
  
  // Contadores de notificações
  const [pendentesCuidador, setPendentesCuidador] = useState<number>(0);
  const [reagendadosCliente, setReagendadosCliente] = useState<number>(0);

  useEffect(() => {
    const id = getUserId();
    setUserId(id);
  }, []);

  // Se a role não indicar explicitamente 'CUIDADOR', tentar validar usando localStorage
  useEffect(() => {
    // Aguardar userId estar definido antes de detectar tipo de usuário
    if (!userId) return;
    
    // Verificar diretamente pela role armazenada no localStorage
    // Sem fazer chamadas API que podem falhar por falta de permissão
    if (isRoleCuidador()) {
      setDetectedCuidador(true);
      return;
    }

    // Tentar verificar pelo objeto user no localStorage
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        const roleName = (user.roleName || user.roleCode || '').toUpperCase();
        if (roleName.includes('CUIDADOR') || roleName.includes('CAREHUB_CUIDADOR')) {
          setDetectedCuidador(true);
          return;
        }
      } catch {
        // Erro ao parsear localStorage
      }
    }

    // Não é cuidador
    setDetectedCuidador(false);
  }, [userId]);

  // Carregar contadores de notificações
  useEffect(() => {
    const carregarContadores = async () => {
      // Aguardar userId e detectedCuidador estarem definidos
      if (!userId || detectedCuidador === null) return;

      try {
        if (detectedCuidador) {
          // Cuidador: buscar agendamentos pendentes de confirmação
          const { count } = await agendamentosApi.contarPendentesCuidador();
          setPendentesCuidador(count);
        } else {
          // Cliente: buscar agendamentos reagendados (contrapropostas)
          const { count } = await agendamentosApi.contarReagendadosCliente();
          setReagendadosCliente(count);
        }
      } catch {
        // Silenciosamente ignora erro
      }
    };

    carregarContadores();
  }, [userId, detectedCuidador]);

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
      icon: reagendadosCliente > 0 ? (
        <Badge badgeContent={reagendadosCliente} color="warning">
          <Event sx={{ fontSize: 40 }} />
        </Badge>
      ) : (
        <Event sx={{ fontSize: 40 }} />
      ),
      title: 'Meus Agendamentos',
      desc: reagendadosCliente > 0 
        ? `${reagendadosCliente} proposta(s) de nova data` 
        : 'Gerencie seus agendamentos',
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
      icon: pendentesCuidador > 0 ? (
        <Badge badgeContent={pendentesCuidador} color="error">
          <CalendarMonth sx={{ fontSize: 40 }} />
        </Badge>
      ) : (
        <CalendarMonth sx={{ fontSize: 40 }} />
      ),
      title: 'Meus Agendamentos',
      desc: pendentesCuidador > 0 
        ? `${pendentesCuidador} agendamento(s) pendente(s)!` 
        : 'Gerencie atendimentos agendados',
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
