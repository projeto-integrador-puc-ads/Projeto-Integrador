// Página Inicial
export { default as CareHubHomePage } from './pages/CareHubHomePage';

// Páginas do Cliente (Dona Maria - ID 2)
export { default as CuidadoresPage } from './pages/CuidadoresPage';
export { default as AgendamentosPage } from './pages/AgendamentosPage';
export { default as ProntuarioPage } from './pages/ProntuarioPage';
export { default as AvaliacoesPage } from './pages/AvaliacoesPage';
export { default as ChatPage } from './pages/ChatPage';

// Páginas do Cuidador (João Cuidador - ID 3)
export { MeusAgendamentosPage } from './pages/MeusAgendamentosPage';
export { ProntuariosClientesPage } from './pages/ProntuariosClientesPage';
export { RegistroAcompanhamentoPage } from './pages/RegistroAcompanhamentoPage';
export { ProximosAtendimentosPage } from './pages/ProximosAtendimentosPage';
export { HistoricoAtendimentosPage } from './pages/HistoricoAtendimentosPage';

// Utilitários de autenticação
export { 
  initializeAuthToken, 
  saveAuthToken, 
  setTokenManually, 
  debugAuthStorage,
  checkAndCacheUserType,
  isCuidador,
  isCliente,
  getUserId,
  getUser,
  getUserRole
} from './components/auth';

export {};
