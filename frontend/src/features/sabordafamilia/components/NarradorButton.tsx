import React, { useState, useEffect, useRef } from 'react';

// Define as propriedades que o componente aceita
interface NarradorButtonProps {
  textoParaLer: string; // A string completa que deve ser lida
}

// Estilos CSS embutidos para o botão flutuante e ícones
// Usamos estilos inline aqui porque este é um componente novo e self-contained
const styles: { [key: string]: React.CSSProperties } = {
  narradorButton: {
    position: 'fixed',
    bottom: '95px',
    right: '20px',
    width: '60px',
    height: '60px',
    backgroundColor: '#002fff', // Cor principal
    color: 'white',
    borderRadius: '50%',
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
    zIndex: 2000,
    transition: 'transform 0.2s ease, background-color 0.2s ease',
  },
  narradorButtonFalando: {
    backgroundColor: '#d32f2f', // Vermelho quando está falando
    transform: 'scale(1.1)',
  },
  icon: {
    width: '32px',
    height: '32px',
  }
};

// Ícone SVG de Alto-falante (Play)
const IconeFalar = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" style={styles.icon}>
    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
  </svg>
);

// Ícone SVG de Parar
const IconeParar = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" style={styles.icon}>
    <path d="M6 6h12v12H6z" />
  </svg>
);

export function NarradorButton({ textoParaLer }: NarradorButtonProps) {
  const [isFalando, setIsFalando] = useState(false);
  
  // Instância da "fala"
  // Usamos useRef para que ela persista entre re-renderizações
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Efeito para parar de falar se o componente for desmontado (ex: mudar de página)
  useEffect(() => {
    // Garante que a fala pare ao sair da página
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const handleToggleFalar = (e: React.MouseEvent) => {
    e.stopPropagation(); // Impede que o clique afete outros elementos

    if (isFalando) {
      // Se está falando, para
      window.speechSynthesis.cancel();
      setIsFalando(false);
    } else {
      // Se não está falando, começa a falar
      
      // Cancela qualquer fala anterior para evitar sobreposição
      window.speechSynthesis.cancel();

      // Cria a "fala"
      const utterance = new SpeechSynthesisUtterance(textoParaLer);
      utterance.lang = 'pt-BR'; // Define a língua para Português do Brasil
      utterance.rate = 1.0; // Velocidade da fala (1.0 = normal)

      // Quando a fala terminar (naturalmente ou por 'cancel'), reseta o estado
      utterance.onend = () => {
        setIsFalando(false);
      };
      utterance.onerror = (event) => {
        console.error("Erro no narrador de voz:", event.error);
        setIsFalando(false);
      };

      // Guarda a referência
      utteranceRef.current = utterance;

      // Inicia a fala
      window.speechSynthesis.speak(utterance);
      setIsFalando(true);
    }
  };

  return (
    <button
      onClick={handleToggleFalar}
      style={{
        ...styles.narradorButton,
        ...(isFalando ? styles.narradorButtonFalando : {}),
      }}
      aria-label={isFalando ? "Parar narração" : "Iniciar narração da página"}
    >
      {isFalando ? <IconeParar /> : <IconeFalar />}
    </button>
  );
}