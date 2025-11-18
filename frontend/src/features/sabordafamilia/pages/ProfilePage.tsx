import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
// import type { UsuarioDTO } from '../../../shared/types/usuario';
import './ProfilePage.css'; 

// --- TIPOS LOCAIS ---
type UsuarioDTO = {
  id: number;
  nome: string;
  fotoPerfil?: string;
};

const API_BASE_URL = 'http://localhost:8080';
const PROFILE_IMAGE_URL = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQVk5HAAp_moZxzJs-yR5vDpE1IBIktBJjWkMq9uRDg0_-zPSqF8a_anDc9Is5cMLPGSdQ&usqp=CAU';

export function ProfilePage() {
  const { id } = useParams<{ id: string }>(); 
  const navigate = useNavigate();

  const [user, setUser] = useState<UsuarioDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/api/sabordafamilia/usuarios/${id}`); 

        if (!response.ok) {
          throw new Error('Falha ao buscar dados do perfil.');
        }

        const userData: UsuarioDTO = await response.json();
        setUser(userData);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [id]);

  if (loading) {
    return <div className="list-page-message">Carregando perfil...</div>;
  }
  
  if (error) {
    return <div className="list-page-message error">{error}</div>;
  }
  
  if (!user) {
    return <div className="list-page-message">Não foi possível carregar os dados do usuário.</div>;
  }

  const handleSendMessage = () => {
    navigate(`/chat/${user.id}`); 
  };

  const handleViewRecipes = () => {
    // Envia o estado para o FeedPage filtrar
    navigate('/', { 
      state: { 
        defaultTab: 'minhas', 
        userIdToFilter: user.id 
      } 
    });
  };

  return (
    <div className="profile-page">
      <div className="profile-header">
        <img 
          // Tenta usar a foto do usuário, senão usa a padrão
          src={user.fotoPerfil ? `${API_BASE_URL}/uploads/${user.fotoPerfil}` : PROFILE_IMAGE_URL}
          alt="Foto de perfil" 
          className="profile-avatar"
          onError={(e) => (e.currentTarget.src = PROFILE_IMAGE_URL)}
        />
        <h2>{user.nome}</h2>
      </div>

      <div className="profile-actions">
        <button onClick={handleSendMessage}>
          💬 Enviar Mensagem
        </button>
        <button onClick={handleViewRecipes}>
          📖 Ver Receitas de {user.nome}
        </button>
      </div>
    </div>
  );
}