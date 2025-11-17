import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import './MainLayout.css'; 

const LOGGED_IN_USER_ID = '1';

export function MainLayout() {
  return (
    <div className="main-layout">
      
      {/* O conteúdo principal (Feed, Perfil, etc.) vem primeiro */}
      <main className="content">
        <Outlet />
      </main>

      {/* A barra de navegação agora está EMBAIXO e com a classe 'bottom-navbar' */}
      <nav className="bottom-navbar">
        <NavLink to="/" end>
          <span className="nav-icon">🏠</span>
          <span className="nav-label">Feed</span>
        </NavLink>
        <NavLink to="/nova-receita">
          <span className="nav-icon">➕</span>
          <span className="nav-label">Nova Receita</span>
        </NavLink>
        <NavLink to={`/perfil/${LOGGED_IN_USER_ID}`}>
          <span className="nav-icon">👤</span>
          <span className="nav-label">Perfil</span>
        </NavLink>
        <NavLink to="/favoritos">
          <span className="nav-icon">⭐</span>
          <span className="nav-label">Favoritos</span>
        </NavLink>
        <NavLink to="/chat">
          <span className="nav-icon">💬</span>
          <span className="nav-label">Chat</span>
        </NavLink>
      </nav>
      
    </div>
  );
}