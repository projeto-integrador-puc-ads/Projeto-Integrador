import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import {
  CareHubHomePage,
  CuidadoresPage,
  AgendamentosPage,
  ProntuarioPage,
  AvaliacoesPage,
  ChatPage,
  MeusAgendamentosPage,
  ProntuariosClientesPage,
  RegistroAcompanhamentoPage,
  ProximosAtendimentosPage,
  HistoricoAtendimentosPage
} from '../index';

export function CareHubRoutes() {
  return (
    <Routes>
      {/* Página inicial do CareHub (rota relativa) */}
      <Route index element={<CareHubHomePage />} />

      {/* Rota de debug temporária (relativa) */}
      <Route path="debug" element={<CareHubDebugPage />} />

      {/* Rotas compartilhadas */}
      <Route path="proximos" element={<ProximosAtendimentosPage />} />
      <Route path="historico-atendimentos" element={<HistoricoAtendimentosPage />} />
      <Route path="chat" element={<ChatPage />} />

      {/* Rotas do Cliente */}
      <Route path="cuidadores" element={<CuidadoresPage />} />
      <Route path="agendamentos" element={<AgendamentosPage />} />
      <Route path="prontuario" element={<ProntuarioPage />} />
      <Route path="avaliacoes/:id" element={<AvaliacoesPage />} />

      {/* Rotas do Cuidador */}
      <Route path="cuidador/agendamentos" element={<MeusAgendamentosPage />} />
      <Route path="cuidador/prontuarios" element={<ProntuariosClientesPage />} />
      <Route path="cuidador/registro" element={<RegistroAcompanhamentoPage />} />
      <Route path="cuidador/atendimentos" element={<ProximosAtendimentosPage />} />

      {/* Rota fallback - redireciona para home do carehub */}
      <Route path="*" element={<Navigate to="/carehub" replace />} />
    </Routes>
  );
}

// Componente de debug temporário
function CareHubDebugPage() {
  const [tokenInput, setTokenInput] = React.useState('');
  const [debugInfo, setDebugInfo] = React.useState<any>(null);

  React.useEffect(() => {
    // Importar função de debug
    import('../components/auth').then(({ debugAuthStorage }) => {
      const info = debugAuthStorage();
      setDebugInfo(info);
    });
  }, []);

  const handleSetToken = () => {
    if (tokenInput.trim()) {
      import('../components/auth').then(({ setTokenManually }) => {
        setTokenManually(tokenInput.trim());
        alert('Token configurado! Volte para /carehub');
      });
    }
  };

  const handleAutoDetect = () => {
    // Tentar detectar token automaticamente
    const token = localStorage.getItem('token') ||
                  localStorage.getItem('accessToken') ||
                  localStorage.getItem('jwtToken') ||
                  localStorage.getItem('authToken');

    if (token) {
      setTokenInput(token);
      alert('Token detectado automaticamente!');
    } else {
      alert('Nenhum token encontrado automaticamente.');
    }
  };

  return React.createElement('div', {
    style: { padding: '20px', maxWidth: '800px', margin: '0 auto' }
  }, [
    React.createElement('h1', { key: 'title' }, 'CareHub - Debug de Autenticação'),

    React.createElement('div', {
      key: 'storage-status',
      style: { marginBottom: '20px', padding: '15px', backgroundColor: '#f5f5f5', borderRadius: '8px' }
    }, [
      React.createElement('h3', { key: 'storage-title' }, 'Status do localStorage:'),
      debugInfo && React.createElement('pre', {
        key: 'storage-data',
        style: { fontSize: '12px', backgroundColor: '#fff', padding: '10px', borderRadius: '4px' }
      }, JSON.stringify(debugInfo, null, 2))
    ]),

    React.createElement('div', {
      key: 'token-setup',
      style: { marginBottom: '20px', padding: '15px', backgroundColor: '#e3f2fd', borderRadius: '8px' }
    }, [
      React.createElement('h3', { key: 'token-title' }, 'Configurar Token Manualmente:'),
      React.createElement('p', { key: 'token-desc' }, 'Cole o token JWT aqui (você pode encontrá-lo no console de rede do navegador após fazer login):'),
      React.createElement('textarea', {
        key: 'token-input',
        value: tokenInput,
        onChange: (e: any) => setTokenInput(e.target.value),
        placeholder: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        style: { width: '100%', height: '100px', marginBottom: '10px' }
      }),
      React.createElement('button', {
        key: 'set-token-btn',
        onClick: handleSetToken,
        style: { marginRight: '10px', padding: '8px 16px' }
      }, 'Configurar Token'),
      React.createElement('button', {
        key: 'auto-detect-btn',
        onClick: handleAutoDetect,
        style: { padding: '8px 16px' }
      }, 'Detectar Automaticamente')
    ]),

    React.createElement('div', {
      key: 'back-link',
      style: { marginBottom: '20px' }
    }, React.createElement('a', {
      href: '/carehub',
      style: { color: '#1976d2', textDecoration: 'none' }
    }, '← Voltar para CareHub'))
  ]);
}
