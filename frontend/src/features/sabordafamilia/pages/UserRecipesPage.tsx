import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { RecipeCard } from '../components/RecipeCard';
import type { Recipe } from '../../../shared/types/Recipe';
import './ListPage.css'; // Reutilizando o mesmo estilo

export function UserRecipesPage() {
  const [userRecipes, setUserRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserRecipes = async () => {
      try {
        // Endpoint para buscar as receitas criadas pelo usuário logado
        const response = await fetch('/api/usuarios/me/receitas');

        if (!response.ok) {
          throw new Error('Falha ao buscar suas receitas.');
        }

        const data: Recipe[] = await response.json();
        setUserRecipes(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserRecipes();
  }, []);

  if (loading) {
    return <div className="list-page-message">Carregando suas receitas...</div>;
  }

  if (error) {
    return <div className="list-page-message error">Erro: {error}</div>;
  }

  return (
    <div className="list-page">
      <h1>Minhas Receitas Publicadas</h1>
      
      {userRecipes.length === 0 ? (
        <p className="list-page-message">Você ainda não publicou nenhuma receita.</p>
      ) : (
        <div className="recipe-grid">
          {userRecipes.map(recipe => (
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