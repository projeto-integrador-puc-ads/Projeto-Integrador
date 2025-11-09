import { Route, Routes, Navigate } from 'react-router-dom';
import AppLayout from '@/layouts/AppLayout';
import { ModuleGrid } from '@/components/ModuleGrid';
import UsuariosPage from '@/features/grupo1/pages/UsuariosPage';
import LoginPage from '@/features/auth/pages/LoginPage';
import AdminPage from '@/features/admin/pages/AdminPage';
import EditUsuarioPage from '@/features/admin/pages/EditUsuarioPage';
import EditMedicoPage from '@/features/admin/pages/EditMedicoPage';
import EditCuidadorPage from '@/features/admin/pages/EditCuidadorPage';
import AdminUsuariosPage from '@/features/admin/pages/AdminUsuariosPage';
import AdminMedicosPage from '@/features/admin/pages/AdminMedicosPage';
import AdminCuidadoresPage from '@/features/admin/pages/AdminCuidadoresPage';
import AtendimentoMedico from '@/features/atendimento/AtendimentoMedico';
import {
  CuidadoresPage,
  ProntuarioPage,
  AvaliacoesPage,
  ChatPage,
  MeusAgendamentosPage,
  ProntuariosClientesPage,
  RegistroAcompanhamentoPage,
  ProximosAtendimentosPage,
} from '@/features/carehub';
import { HistoricoAtendimentosPage } from '@/features/carehub/pages/HistoricoAtendimentosPage';
import CareHubHomePage from '@/features/carehub/pages/CareHubHomePage';
import AgendamentosNegociacaoPage from '@/features/carehub/pages/AgendamentosNegociacaoPage';

function Home() {
  return (
    <div>
      <h1 style={{ fontSize: '2rem', margin: 0 }}>Plataforma de Auxílio ao Idoso</h1>
      <p style={{ fontSize: '1.125rem', lineHeight: 1.7, color: '#345' }}>
        Bem-vindo(a)! Esta é uma plataforma para promover bem-estar e inclusão.
      </p>
      <h2 style={{ fontSize: '1.6rem' }}>Módulos</h2>
      <ModuleGrid />
    </div>
  );
}

export function AppRoutes() {
  return (
    <Routes>
      {/* Tela inicial: Login */}
      <Route path="/" element={<LoginPage />} />

      {/* Áreas autenticadas */}
      <Route element={<AppLayout />}>
        <Route path="/home" element={<Home />} />

        {/* Rotas administrativas */}
        <Route path="admin" element={<AdminPage />} />
        <Route path="admin/usuarios" element={<AdminUsuariosPage />} />
        <Route path="admin/medicos" element={<AdminMedicosPage />} />
        <Route path="admin/cuidadores" element={<AdminCuidadoresPage />} />
        <Route path="admin/usuarios/:id/edit" element={<EditUsuarioPage />} />
        <Route path="admin/medicos/:id/edit" element={<EditMedicoPage />} />
        <Route path="admin/cuidadores/:id/edit" element={<EditCuidadorPage />} />

        {/* Rotas gerais */}
        <Route path="usuarios" element={<UsuariosPage />} />

        {/* Nova rota: Atendimento Médico */}
        <Route path="atendimento" element={<AtendimentoMedico />} />

        {/* Rota fallback */}
        
        {/* CareHub - Página Inicial */}
        <Route path="carehub" element={<CareHubHomePage />} />
        
        {/* CareHub - Módulos do Cliente */}
        <Route path="carehub/cuidadores" element={<CuidadoresPage />} />
        <Route path="carehub/agendamentos" element={<AgendamentosNegociacaoPage />} />
        <Route path="carehub/prontuario" element={<ProntuarioPage />} />
        <Route path="carehub/avaliacoes/:id" element={<AvaliacoesPage />} />
        <Route path="carehub/chat" element={<ChatPage />} />
        
        {/* CareHub - Módulos do Cuidador */}
        <Route path="carehub/cuidador/agendamentos" element={<MeusAgendamentosPage />} />
        <Route path="carehub/cuidador/prontuarios" element={<ProntuariosClientesPage />} />
        <Route path="carehub/cuidador/registros" element={<RegistroAcompanhamentoPage />} />
        <Route path="carehub/registro-acompanhamento" element={<RegistroAcompanhamentoPage />} />
        <Route path="carehub/historico-atendimentos" element={<HistoricoAtendimentosPage />} />
        
        {/* CareHub - Páginas Compartilhadas */}
        <Route path="carehub/proximos" element={<ProximosAtendimentosPage />} />
        
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Route>
    </Routes>
  );
}
