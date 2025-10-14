import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import './MainLayout.css'; 

export function MainLayout() {
  return (
    <div className="main-layout">
      <main className="content">
        {/* O Outlet renderiza a página da rota atual (Feed, Perfil, etc.) */}
        <Outlet />
      </main>

      <nav className="bottom-nav">
        <NavLink to="/" end>Feed</NavLink>
        <NavLink to="/nova-receita">Nova Receita</NavLink>
        <NavLink to="/perfil">Perfil</NavLink>
        <NavLink to="/favoritos">Favoritos</NavLink>
        <NavLink to="/chat">Chat</NavLink>
      </nav>
    </div>
  );
}