import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '../../../shared/types/User'; // Modelo de dados do usuário
import './ProfilePage.css'; // Estilo para a página

export function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const navigate = useNavigate();

  // Busca os dados do usuário logado na API
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        // Este endpoint no backend deve usar o header X-User-Id
        // para identificar e retornar os dados do usuário correto.
        const response = await fetch('/api/usuarios/me'); 

        if (!response.ok) {
          throw new Error('Falha ao buscar dados do perfil. Por favor, tente fazer login novamente.');
        }

        const userData: User = await response.json();
        setUser(userData);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []); // O array vazio [] garante que isso execute apenas uma vez

  if (loading) {
    return <div>Carregando perfil...</div>;
  }

  if (error) {
    return <div className="error-message">Erro: {error}</div>;
  }
  
  if (!user) {
    return <div>Não foi possível carregar os dados do usuário.</div>;
  }

  return (
    <div className="profile-page">
      <div className="profile-header">
        <img 
          src={user.fotoPerfil || '/default-avatar.png'} 
          alt="Foto de perfil" 
          className="profile-avatar"
        />
        <h2>{user.nome}</h2>
        <p>Idade: {user.idade}</p>
        <p>Interesses: {user.interessesCulinarios || 'Não informado'}</p>
      </div>

      <div className="profile-actions">
        <button onClick={() => navigate('/favoritos')}>
          ⭐ Ver Favoritos
        </button>
        <button onClick={() => navigate('/minhas-receitas')}>
          📖 Ver Minhas Receitas
        </button>
        {/* Futuramente, um botão de logout pode ser adicionado aqui */}
      </div>
    </div>
  );
}