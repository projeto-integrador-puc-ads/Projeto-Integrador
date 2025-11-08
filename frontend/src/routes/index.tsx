import { Route, Routes, Navigate } from 'react-router-dom';
import AppLayout from '@/layouts/AppLayout';
import { ModuleGrid } from '@/components/ModuleGrid';
import UsuariosPage from '@/features/grupo1/pages/UsuariosPage';
import {
  CuidadoresPage,
  AgendamentosPage,
  ProntuarioPage,
  AvaliacoesPage,
  ChatPage,
  MeusAgendamentosPage,
  ProntuariosClientesPage,
  RegistroAcompanhamentoPage,
  ProximosAtendimentosPage,
} from '@/features/carehub';
import CareHubHomePage from '@/features/carehub/pages/CareHubHomePage';

function Home() {
  return (
    <div>
      <h1 style={{ fontSize: '2rem', margin: 0 }}>UNADE — Plataforma de Auxílio ao Idoso</h1>
      <p style={{ fontSize: '1.125rem', lineHeight: 1.7, color: '#345' }}>
        Bem-vindo(a)! Esta é uma plataforma para promover autonomia, bem-estar e inclusão.
      </p>
      <h2 style={{ fontSize: '1.6rem' }}>Módulos</h2>
      <ModuleGrid />
    </div>
  );
}

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<Home />} />
        <Route path="usuarios" element={<UsuariosPage />} />
        
        {/* CareHub - Página Inicial */}
        <Route path="carehub" element={<CareHubHomePage />} />
        
        {/* CareHub - Módulos do Cliente */}
        <Route path="carehub/cuidadores" element={<CuidadoresPage />} />
        <Route path="carehub/agendamentos" element={<AgendamentosPage />} />
        <Route path="carehub/prontuario" element={<ProntuarioPage />} />
        <Route path="carehub/avaliacoes/:id" element={<AvaliacoesPage />} />
        <Route path="carehub/chat" element={<ChatPage />} />
        
        {/* CareHub - Módulos do Cuidador */}
        <Route path="carehub/cuidador/agendamentos" element={<MeusAgendamentosPage />} />
        <Route path="carehub/cuidador/prontuarios" element={<ProntuariosClientesPage />} />
        <Route path="carehub/cuidador/registros" element={<RegistroAcompanhamentoPage />} />
        
        {/* CareHub - Páginas Compartilhadas */}
        <Route path="carehub/proximos" element={<ProximosAtendimentosPage />} />
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
