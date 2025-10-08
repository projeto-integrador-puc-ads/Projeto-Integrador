import { Route, Routes, Navigate } from 'react-router-dom';
import AppLayout from '@/layouts/AppLayout';
import { ModuleGrid } from '@/components/ModuleGrid';
import UsuariosPage from '@/features/grupo1/pages/UsuariosPage';

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
      <Route element={<AppLayout />}>
        <Route index element={<Home />} />
        <Route path="usuarios" element={<UsuariosPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
