import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { RecipeCard } from '../components/RecipeCard'; // Assumindo que criaremos este componente
import { Recipe } from '../../../shared/types/Recipe'; // Nosso modelo de dados

export function FeedPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  // useEffect é um hook que executa código quando o componente é montado.
  // Perfeito para buscar dados de uma API.
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        // Faz a chamada para o endpoint do seu backend
        const response = await fetch('/api/receitas'); // Ajuste o endpoint se necessário

        if (!response.ok) {
          throw new Error('Falha ao buscar as receitas.');
        }

        const data: Recipe[] = await response.json();
        setRecipes(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false); // Termina o carregamento, independentemente de sucesso ou erro
      }
    };

    fetchRecipes();
  }, []); // O array vazio [] garante que isso execute apenas uma vez

  // --- Renderização condicional ---

  if (loading) {
    return <div>Carregando receitas...</div>;
  }

  if (error) {
    return <div>Erro: {error}</div>;
  }

  return (
    <div>
      <h1>Receitas da Comunidade</h1>

      {recipes.length === 0 ? (
        <div style={{ textAlign: 'center', marginTop: '50px', color: 'grey' }}>
          <p>Nenhuma receita cadastrada ainda.</p>
        </div>
      ) : (
        <div className="feed-list">
          {recipes.map((recipe) => (
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