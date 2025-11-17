import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { RecipeCard } from '../components/RecipeCard';
import type { Recipe } from '../../../shared/types/Recipe';
import './ListPage.css';

// --- SIMULAÇÃO DE LOGIN ---
const TEST_USER_ID = '1';
// -------------------------

export function FavoritesPage() {
  const [favoriteRecipes, setFavoriteRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await fetch('/api/sabordafamilia/usuarios/me/favoritos', {
            method: 'GET',
            headers: {
                'X-User-Id': TEST_USER_ID // Envia o header
            }
        });

        if (!response.ok) {
          throw new Error('Falha ao buscar as receitas favoritas.');
        }

        const data: Recipe[] = await response.json();
        setFavoriteRecipes(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchFavorites();
  }, []);

  if (loading) {
    return <div className="list-page-message">Carregando favoritos...</div>;
  }
  
  if (error) {
    return <div className="list-page-message error">{error}</div>;
  }

  return (
    <div className="list-page">
      <h1>Minhas Receitas Favoritas</h1>
      
      {favoriteRecipes.length === 0 ? (
        <p className="list-page-message">Você ainda não favoritou nenhuma receita.</p>
      ) : (
        <div className="feed-list"> {/* Usando o mesmo CSS de 2 colunas do feed */}
          {favoriteRecipes.map(recipe => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              onClick={() => navigate(`/receita/${recipe.id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
}