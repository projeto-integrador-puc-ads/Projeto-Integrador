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
import AtendimentoMedico from '@/features/diario_saude/Idoso/AtendimentoMedico';
import ReceituarioPage from '@/features/diario_saude/Medico/ReceituarioPage';
import DiagnosticarDoencaPage from '@/features/diario_saude/Medico/DiagnosticarDoencaPage';
import InformacoesSaude from '@/features/diario_saude/Idoso/InformacoesSaude';
import IniciarConsulta from '@/features/diario_saude/Medico/IniciarConsultaPage';
import MedicoDashboard from '@/features/diario_saude/Medico/MedicoDashboard';
import InformacoesMedicoPage from '@/features/diario_saude/Medico/InformacoesMedicoPage';
import PedirExamesPage from '@/features/diario_saude/Medico/PedirExamesPage';
import QuestionarioPage from '@/features/diario_saude/Idoso/QuestionarioPage';
import RecomendacaoExerciciosPage from '@/features/diario_saude/Medico/RecomendacaoExerciciosPage';
import HistoricoConsultasPage from '@/features/diario_saude/Idoso/HistoricoConsultasPage';
import AlergiasPage from '@/features/diario_saude/Medico/AlergiasPage';
import SaudeMenuPage from '@/features/diario_saude/Idoso/SaudeMenuPage';
import RespostasPage from '@/features/diario_saude/Idoso/RespostasPage';
import HistoricoConsultasMedicoPage from '@/features/diario_saude/Medico/HistoricoConsultasMedicoPage';
import AdminUsuarioCreatePage from '@/features/admin/pages/AdminUsuarioCreatePage';



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
        <Route path="admin/usuarios/novo" element={<AdminUsuarioCreatePage />} />
        <Route path="admin/medicos" element={<AdminMedicosPage />} />
        <Route path="admin/cuidadores" element={<AdminCuidadoresPage />} />
        <Route path="admin/usuarios/:id/edit" element={<EditUsuarioPage />} />
        <Route path="admin/medicos/:id/edit" element={<EditMedicoPage />} />
        <Route path="admin/cuidadores/:id/edit" element={<EditCuidadorPage />} />

        {/* Rotas gerais */}
        <Route path="usuarios" element={<UsuariosPage />} />

        {/* rota: Saúde do idoso */}
        <Route path="saude" element={<SaudeMenuPage />} />
        <Route path="/historico_consultas" element={<HistoricoConsultasPage />} />
        <Route path="/informacoes_saude" element={<InformacoesSaude />} />
        <Route path="/questionario_saude" element={<QuestionarioPage />} />
        <Route path="/respostas_questionario" element={<RespostasPage />} />

        {/* rota: Atendimento Médico */}
        <Route path="atendimento" element={<AtendimentoMedico />} />
        <Route path="atendimento/receituario" element={<ReceituarioPage />} />
        <Route path="atendimento/exames" element={<PedirExamesPage />} />
        <Route path="atendimento/exercicios" element={<RecomendacaoExerciciosPage />} />
        <Route path="atendimento/alergias" element={<AlergiasPage />} />
        <Route path="atendimento/doencas" element={<DiagnosticarDoencaPage />} />
        <Route path="/atendimento/historico-medico" element={<HistoricoConsultasMedicoPage />} />

        {/* Página inicial do médico */}
        <Route path="medico" element={<IniciarConsulta />} />
        <Route path="atendimento/dashboard" element={<MedicoDashboard />} />

        {/* Página de edição do médico */}
        <Route path="/informacoes_medico" element={<InformacoesMedicoPage />} />

        {/* Rota fallback */}
        <Route path="*" element={<Navigate to="/home" replace />} />

      </Route>
    </Routes>
  );
}
