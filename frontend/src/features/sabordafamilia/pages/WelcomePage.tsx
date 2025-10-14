import React from 'react';
import { useNavigate } from 'react-router-dom';

export function WelcomePage() {
  const navigate = useNavigate();

  // Função para navegar para a tela de nova receita
  const handleStart = () => {
    navigate('/nova-receita'); // Navega para a rota de criar receita
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      height: '100vh', // Ocupa a tela inteira
      padding: '24px'
    }}>
      {/* Ícone (pode ser um SVG ou de uma biblioteca de ícones) */}
      <span style={{ fontSize: '100px' }}>🍽️</span>
      
      <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>
        Bem-vindo ao Sabores da Família!
      </h1>
      
      <p style={{ fontSize: '18px', margin: '16px 0' }}>
        Aqui você pode registrar suas receitas de família e compartilhar com amigos e familiares.
        <br/><br/>
        Clique em 'Nova Receita' para adicionar a primeira!
      </p>

      <button onClick={handleStart} style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px', 
          padding: '10px 20px' 
      }}>
        <span>➕</span>
        Cadastrar minha primeira receita
      </button>
    </div>
  );
}