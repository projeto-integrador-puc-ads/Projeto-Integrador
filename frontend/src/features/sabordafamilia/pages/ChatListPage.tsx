import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// import type { UsuarioDTO } from '../../../shared/types/usuario'; // Vamos definir localmente
import './ChatListPage.css';

// --- DEFINIÇÕES DE TIPO PARA BATER COM O BACKEND ---
// Simula o UsuarioDTO.java
type UsuarioDTO = {
  id: number;
  nome: string;
  fotoPerfil?: string; // fotoPerfil é opcional
};

// Simula o ConversaSummaryDTO.java
type ConversationSummary = {
  contato: UsuarioDTO;
  ultimaMensagem: string;
  dataUltimaMensagem: string; // O JSON converte LocalDateTime para String
};

// --- SIMULAÇÃO DE LOGIN ---
const TEST_USER_ID = '1'; 
const API_BASE_URL = 'http://localhost:8080'; // Para a foto de perfil
// -------------------------

export function ChatListPage() {
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        // --- CORREÇÕES NA CHAMADA DA API ---
        const response = await fetch('/api/sabordafamilia/mensagens/conversas', {
          method: 'GET',
          headers: {
            'X-User-Id': TEST_USER_ID // Envia o header de autenticação
          }
        });

        if (!response.ok) {
          throw new Error('Falha ao carregar as conversas.');
        }
        
        const data: ConversationSummary[] = await response.json();
        setConversations(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, []);

  // Função para formatar a data (simplificada)
  const formatTimestamp = (dateString: string) => {
    const date = new Date(dateString);
    // Formato simples "HH:MM"
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return <div className="chat-list-message">Carregando conversas...</div>;
  }

  if (error) {
    return <div className="chat-list-message error">Erro: {error}</div>;
  }

  return (
    <div className="chat-list-page">
      <h1>Conversas</h1>
      {conversations.length === 0 ? (
        <p className="chat-list-message">Você não possui nenhuma conversa.</p>
      ) : (
        <ul className="conversation-list">
          {conversations.map(convo => (
            <li 
              key={convo.contato.id}
              className="conversation-item"
              // Navega para a página de chat específica com o ID do contato
              onClick={() => navigate(`/chat/${convo.contato.id}`)}
            >
              <img 
                // Tenta usar a foto de perfil, se não, usa a padrão
                src={convo.contato.fotoPerfil ? `${API_BASE_URL}/uploads/${convo.contato.fotoPerfil}` : 'https://placehold.co/60x60/f0e0d0/555?text=Foto'} 
                alt={convo.contato.nome} 
                className="avatar"
                // Fallback se a imagem der erro
                onError={(e) => (e.currentTarget.src = 'https://placehold.co/60x60/f0e0d0/555?text=Foto')}
              />
              <div className="conversation-details">
                <span className="contact-name">{convo.contato.nome}</span>
                <span className="last-message">{convo.ultimaMensagem}</span>
              </div>
              {/* Mostra a data da última mensagem */}
              <span className="last-message-time">
                {formatTimestamp(convo.dataUltimaMensagem)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}