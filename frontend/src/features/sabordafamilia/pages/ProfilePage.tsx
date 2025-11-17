import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { UsuarioDTO } from '../../../shared/types/usuario';
import './ProfilePage.css'; 

// --- SIMULAÇÃO DE LOGIN E IMAGEM ---
const TEST_USER_ID = '1';
// Link de uma foto de uso livre (via Pexels) de uma cozinheira idosa sorrindo.
const PROFILE_IMAGE_URL = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQVk5HAAp_moZxzJs-yR5vDpE1IBIktBJjWkMq9uRDg0_-zPSqF8a_anDc9Is5cMLPGSdQ&usqp=CAU';
// ------------------------------------

export function ProfilePage() {
  const { id } = useParams<{ id: string }>(); 
  const navigate = useNavigate();

  const [user, setUser] = useState<UsuarioDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Busca os dados do usuário logado na API
  // Busca os dados do usuário com base no ID da URL
  useEffect(() => {
    if (!id) return; // Não faz nada se não tiver ID

    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/sabordafamilia/usuarios/${id}`); 

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
  }, [id]); // <-- Re-executa se o ID da URL mudar

  if (loading) {
    return <div className="list-page-message">Carregando perfil...</div>;
  }
  // ... (o resto da lógica de loading/error) ...
  
  if (!user) {
    return <div className="list-page-message">Não foi possível carregar os dados do usuário.</div>;
  }

  const handleSendMessage = () => {
    // Navega para a tela de chat com o ID deste usuário
    navigate(`/chat/${user.id}`); 
  };

  const handleViewRecipes = () => {
    // 1. Navega de volta para o Feed (/)
    // 2. Envia um "state" para o FeedPage, dizendo qual aba abrir
    //    (e qual usuário filtrar)
    navigate('/', { 
      state: { 
        defaultTab: 'minhas', // Diz para o Feed abrir a aba "Minhas Receitas"
        userIdToFilter: user.id // Diz para o Feed filtrar por este usuário
      } 
    });
  };


  return (
    <div className="profile-page">
      <div className="profile-header">
        <img 
          src={PROFILE_IMAGE_URL} 
          alt="Foto de perfil" 
          className="profile-avatar"
        />
        <h2>{user.nome}</h2>
      </div>

      <div className="profile-actions">
        <button onClick={handleSendMessage}>
          💬 Enviar Mensagem
        </button>
        <button onClick={handleViewRecipes}>
          📖 Ver Receitas
        </button>
      </div>
    </div>
  );
}