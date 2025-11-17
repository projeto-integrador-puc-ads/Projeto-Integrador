import React from 'react';
// import type { Recipe } from '../../../shared/types/Recipe'; // <-- REMOVIDO
import './RecipeCard.css'; // <-- VOU RESTAURAR ISTO (descomentado)

const API_BASE_URL = 'http://localhost:8080';

// --- DEFINIÇÕES DE TIPO ADICIONADAS LOCALMENTE ---
// (Copiado do RecipeDetailPage.tsx para consistência)
type Usuario = {
  id: number;
  nome: string;
};

type Midia = {
  id: number;
  caminhoArquivo: string;
  tipoMidia: string;
};

type Restricoes = {
  id: number;
  temGluten: boolean;
  temLactose: boolean;
  temAcucar: boolean;
};

// Interface principal da Receita, alinhada com o Backend
type Recipe = {
  id: number;
  titulo: string;
  ingredientes: string;
  tipoRefeicao?: string;
  autor: Usuario;
  midias: Midia[];
  restricoes?: Restricoes;
  contagemCurtidas: number; // <-- O campo que precisamos
};


interface RecipeCardProps {
  recipe: Recipe; // <-- Agora usa a 'Recipe' definida localmente
  onClick: () => void;
}

// Componente pequeno para as "pílulas" de restrição
function RestricaoPill({ text }: { text: string }) {
  // Adicionando um estilo inline simples para as pílulas
  const pillStyle: React.CSSProperties = {
    backgroundColor: '#f0f0f0',
    borderRadius: '12px',
    padding: '2px 8px',
    fontSize: '0.75rem',
    marginRight: '4px',
    display: 'inline-block'
  };
  return <span style={pillStyle}>{text}</span>;
}

export function RecipeCard({ recipe, onClick }: RecipeCardProps) {
  
  const handleShare = async (event: React.MouseEvent) => {
    event.stopPropagation(); // Impede que o clique no botão abra o card
    
    const shareUrl = `${window.location.origin}/receita/${recipe.id}`;
    try {
      await navigator.clipboard.writeText(shareUrl);
      alert('Link da receita copiado!'); 
    } catch (err) {
      console.error('Falha ao copiar:', err);
      console.error('Falha ao copiar o link.');
    }
  };
  
  const imageUrl = recipe.midias && recipe.midias.length > 0
    ? `${API_BASE_URL}/uploads/${recipe.midias[0].caminhoArquivo}`
    : '/default-recipe-image.jpg';

  return (
    <>

      <div className="recipe-card" onClick={onClick} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && onClick()}>
        
        <img src={imageUrl} alt={recipe.titulo} className="recipe-card-image" />
        
        <div className="recipe-card-content">
          
          {recipe.tipoRefeicao && (
            <span className="tipo-refeicao-tag">{recipe.tipoRefeicao}</span>
          )}
          
          <h3>{recipe.titulo}</h3>
          <p className="author">Por: {recipe.autor?.nome || 'Autor desconhecido'}</p>
          
          <div className="card-details-single-column">
            <h4>Ingredientes</h4>
            {/* Limita a exibição dos ingredientes para não quebrar o card */}
            <p style={{ maxHeight: '4.5em', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {recipe.ingredientes}
            </p>
          </div>
          
          {recipe.restricoes && (
            <div className="card-restricoes" style={{ marginTop: '8px' }}>
              {recipe.restricoes.temGluten && <RestricaoPill text="Contém Glúten" />}
              {recipe.restricoes.temLactose && <RestricaoPill text="Contém Lactose" />}
              {recipe.restricoes.temAcucar && <RestricaoPill text="Contém Açúcar" />}
            </div>
          )}
          
          <div className="recipe-card-actions">
            <div className="action-item">
              <span>❤️</span>
              <span>{recipe.contagemCurtidas || 0}</span>
            </div>
            <button onClick={handleShare} className="share-button" aria-label="Compartilhar receita">
              <span>🔗</span>
              <span>Compartilhar</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}