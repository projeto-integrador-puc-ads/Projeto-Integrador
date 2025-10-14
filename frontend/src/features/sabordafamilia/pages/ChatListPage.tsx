import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '../../../shared/types/User'; // Usaremos o tipo User para o contato
import './ChatListPage.css';

// Tipo para representar uma conversa resumida
interface ConversationSummary {
  contact: User;
  lastMessage: string;
  timestamp: string;
}

export function ChatListPage() {
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        // Este endpoint no backend deve retornar um resumo das conversas
        // do usuário logado (identificado pelo header X-User-Id).
        const response = await fetch('/api/mensagens/conversas');

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
              key={convo.contact.id} 
              className="conversation-item"
              onClick={() => navigate(`/chat/${convo.contact.id}`)}
            >
              <img 
                src={convo.contact.fotoPerfil || '/default-avatar.png'} 
                alt={convo.contact.nome} 
                className="avatar"
              />
              <div className="conversation-details">
                <span className="contact-name">{convo.contact.nome}</span>
                <span className="last-message">{convo.lastMessage}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}