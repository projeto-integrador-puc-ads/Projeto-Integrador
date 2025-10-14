import React from 'react';
import { Recipe } from '../../../shared/types/Recipe';
import './RecipeCard.css'; // Arquivo de estilo para o card

// Definimos os tipos das propriedades que o componente receberá
interface RecipeCardProps {
  recipe: Recipe;
  onClick: () => void;
}

export function RecipeCard({ recipe, onClick }: RecipeCardProps) {
  
  const handleShare = (event: React.MouseEvent) => {
    // Impede que o clique no botão de compartilhar acione o clique no card inteiro
    event.stopPropagation();
    
    const shareText = `Confira esta receita: ${recipe.titulo}\n\n${recipe.ingredientes}`;

    // A Web Share API é o equivalente do "share_plus" para a web
    if (navigator.share) {
      navigator.share({
        title: recipe.titulo,
        text: shareText,
        // url: `url-da-sua-app/receita/${recipe.id}` // Descomente quando tiver o link
      }).catch(console.error);
    } else {
      // Fallback para navegadores que não suportam a API (copiar para clipboard)
      navigator.clipboard.writeText(shareText);
      alert('Link da receita copiado para a área de transferência!');
    }
  };
  
  // Imagem padrão caso a receita não tenha uma
  const imageUrl = recipe.midias?.[0]?.caminhoArquivo || '/default-recipe-image.jpg';

  return (
    <div className="recipe-card" onClick={onClick} role="button" tabIndex={0}>
      <img src={imageUrl} alt={recipe.titulo} className="recipe-card-image" />
      
      <div className="recipe-card-content">
        <h3>{recipe.titulo}</h3>
        <p className="author">Por: {recipe.autor?.nome || 'Autor desconhecido'}</p>
        <p className="ingredients">
          {recipe.ingredientes}
        </p>

        <div className="recipe-card-actions">
          <div className="action-item">
            <span>❤️</span>
            <span>{recipe.curtidas}</span>
          </div>
          <div className="action-item">
            <button onClick={handleShare} className="share-button">
              <span>🔗</span>
              <span>Compartilhar</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}