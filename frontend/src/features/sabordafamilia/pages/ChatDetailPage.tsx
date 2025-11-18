import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ChatDetailPage.css'; 
import { NarradorButton } from '../components/NarradorButton';

// --- DEFINIÇÕES GLOBAIS PARA TESTE ---
const API_BASE_URL = 'http://localhost:8080';
const TEST_USER_ID = '1'; 
// ------------------------------------

type Usuario = {
  id: number;
  nome: string;
};

type Mensagem = {
  id: number;
  remetente: Usuario;
  destinatario: Usuario;
  texto: string;
  enviadoEm: string;
};

export function ChatDetailPage() {
  const { contactId } = useParams<{ contactId: string }>();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Mensagem[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [contactName, setContactName] = useState('Carregando...');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [textoNarrador, setTextoNarrador] = useState('Carregando narração...');

  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!contactId) return;
      
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/api/sabordafamilia/mensagens/${contactId}`, {
          headers: { 'X-User-Id': TEST_USER_ID }
        });

        if (!response.ok) {
          throw new Error('Falha ao buscar mensagens.');
        }
        
        const data: Mensagem[] = await response.json();
        setMessages(data);

        if (data.length > 0) {
          const firstMsg = data[0];
          const contact = firstMsg.remetente.id === Number(TEST_USER_ID) 
            ? firstMsg.destinatario 
            : firstMsg.remetente;
          setContactName(contact.nome);
        } else {
          fetch(`${API_BASE_URL}/api/sabordafamilia/usuarios/${contactId}`, {
             headers: { 'X-User-Id': TEST_USER_ID }
          })
          .then(res => res.json())
          .then(userData => setContactName(userData.nome || `Usuário ${contactId}`))
          .catch(() => setContactName(`Usuário ${contactId}`));
        }

      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [contactId]);

  useEffect(() => {
    if (loading) {
        setTextoNarrador(`Carregando conversa com ${contactName}`);
        return;
    }
    
    if (messages.length > 0) {
      const partes = messages.map(msg => {
        const nomeRemetente = msg.remetente.id === Number(TEST_USER_ID) ? 'Você' : contactName;
        return `${nomeRemetente} disse: ${msg.texto}`;
      });
      setTextoNarrador(`Conversa com ${contactName}. \n\n ${partes.join('. \n\n ')}`);
    } else {
      setTextoNarrador(`Não há mensagens nesta conversa com ${contactName}.`);
    }
  }, [messages, contactName, loading]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === '' || !contactId) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/sabordafamilia/mensagens/${contactId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': TEST_USER_ID
        },
        body: JSON.stringify({ conteudo: newMessage })
      });

      if (!response.ok) {
        throw new Error('Falha ao enviar mensagem.');
      }

      const sentMessage: Mensagem = await response.json();
      setMessages(prevMessages => [...prevMessages, sentMessage]);
      setNewMessage(''); 
    
    } catch (err: any) {
      console.error(err.message);
    }
  };

  return (
    <>
      <div className="chat-detail-page">
        <div className="chat-header" onClick={() => navigate('/chat')} style={{cursor: 'pointer'}}>
          ← Voltar para {contactName}
        </div>
        
        {loading && <div className="chat-loading">Carregando histórico...</div>}
        {error && <div className="chat-loading">{error}</div>}
        
        <div className="message-list">
          {messages.map(msg => (
            <div
              key={msg.id}
              className={`message-bubble ${
                msg.remetente.id === Number(TEST_USER_ID) ? 'sent' : 'received'
              }`}
            >
              {msg.texto}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        
        <form className="message-input-area" onSubmit={handleSendMessage}>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Digite uma mensagem..."
          />
          <button type="submit">Enviar</button>
        </form>
      </div>

      <div style={{ transform: 'translateY(-0px)' }}>
        {textoNarrador && <NarradorButton textoParaLer={textoNarrador} />}
      </div>
    </>
  );
}