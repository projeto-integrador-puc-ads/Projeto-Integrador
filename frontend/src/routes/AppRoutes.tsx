// src/routes/AppRoutes.tsx
import { Route, Routes, Navigate } from 'react-router-dom';
import { useState } from 'react';
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
// módulo Medicamentos
import HomeMedicamentos from '@/features/Medicamentos/pages/Home';
import CadastroMedicamento from '@/features/Medicamentos/components/CadastroMedicamento';
import ListaMedicamentos from '@/features/Medicamentos/components/ListaMedicamentos';
import HistoricoMedicamentos from '@/features/Medicamentos/components/HistoricoMedicamentos';
import type { Medicamento } from '@/features/Medicamentos/types/medicamento';


function Home() {
  return (
    <div>
      <h1 style={{ fontSize: '2rem', margin: 0 }}>
        Plataforma de Auxílio ao Idoso
      </h1>
      <p
        style={{
          fontSize: '1.125rem',
          lineHeight: 1.7,
          color: '#345',
        }}
      >
        Bem-vindo(a)! Esta é uma plataforma para promover bem-estar e inclusão.
      </p>
      <h2 style={{ fontSize: '1.6rem' }}>Módulos</h2>
      <ModuleGrid />
    </div>
  );
}

export function AppRoutes() {
  //Estado centralizado dos medicamentos
  const [medicamentos, setMedicamentos] = useState<Medicamento[]>([]);

  //Função de cadastro (atualiza a lista local)
  const handleCadastrar = (novo: Medicamento) => {
    const novoComId = { ...novo, id: Date.now().toString() }; // gera ID simples
    setMedicamentos((prev) => [...prev, novoComId]);
  };

  return (
    <Routes>
      {/* Tela inicial: Login */}
      <Route path="/" element={<LoginPage />} />

      {/* Áreas autenticadas */}
      <Route element={<AppLayout />}>
        {/* Página principal da plataforma */}
        <Route path="/home" element={<Home />} />

        {/* ---------------- ROTAS ADMINISTRATIVAS ---------------- */}
        <Route path="admin" element={<AdminPage />} />
        <Route path="admin/usuarios" element={<AdminUsuariosPage />} />
        <Route path="admin/medicos" element={<AdminMedicosPage />} />
        <Route path="admin/cuidadores" element={<AdminCuidadoresPage />} />
        <Route path="admin/editar-usuario/:id" element={<EditUsuarioPage />} />
        <Route path="admin/editar-medico/:id" element={<EditMedicoPage />} />
        <Route
          path="admin/editar-cuidador/:id"
          element={<EditCuidadorPage />}
        />

        {/* ---------------- ROTAS GERAIS ---------------- */}
        <Route path="usuarios" element={<UsuariosPage />} />

        {/* ---------------- NOVA ROTA: ATENDIMENTO MÉDICO ---------------- */}
        <Route path="atendimento" element={<AtendimentoMedico />} />

        <Route path="medicamentos">
          {/* página inicial do módulo de medicamentos */}
          <Route index element={<HomeMedicamentos />} />

          {/* tela de cadastro */}
          <Route
            path="cadastro"
            element={
              <CadastroMedicamento
                onCadastrar={handleCadastrar}
                medicamentoEditar={null}
              />
            }
          />

          {/* listagem */}
          <Route
            path="lista"
            element={
              <ListaMedicamentos
                medicamentos={medicamentos}
                setMedParaEditar={() => {}}
              />
            }
          />

          {/* histórico */}
          <Route
            path="historico"
            element={<HistoricoMedicamentos historico={medicamentos} />}
          />
        </Route>

        {/* ----------------------------------------------------------------- */}
        {/* ROTA FALLBACK */}
        {/* ----------------------------------------------------------------- */}
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Route>
    </Routes>
  );
}
