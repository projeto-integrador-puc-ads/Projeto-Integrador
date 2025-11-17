import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { RecipeCard,  } from '../components/RecipeCard';
import type { Recipe } from '../../../shared/types/Recipe';
import './FeedPage.css';
import { useLocation } from 'react-router-dom';

// Simula o usuário logado
const TEST_USER_ID = '1';

// Define os tipos de abas
type FeedTab = 'geral' | 'seguindo' | 'minhas';

export function FeedPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = location.state as { defaultTab?: FeedTab, userIdToFilter?: number };

  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [activeTab, setActiveTab] = useState<FeedTab>(locationState?.defaultTab || 'geral');
  const [filterUserId, setFilterUserId] = useState<number | null>(locationState?.userIdToFilter || Number(TEST_USER_ID));

  useEffect(() => {
    const fetchRecipes = async () => {
      setLoading(true); 
      setError(null);
      let apiUrl = '';

      // Define a URL da API com base na aba ativa
      switch (activeTab) {
        case 'geral':
          apiUrl = '/api/sabordafamilia/receitas';
          break;
        
        case 'seguindo':
          // Agora chama o novo endpoint que criamos
          apiUrl = '/api/sabordafamilia/receitas/seguindo'; 
          break;
          
        case 'minhas':
          const idParaFiltrar = filterUserId || TEST_USER_ID; 
          apiUrl = `/api/sabordafamilia/usuarios/${idParaFiltrar}/receitas`;
          break;
      }

      try {
        const response = await fetch(apiUrl, {
          method: 'GET',
          headers: {
            'X-User-Id': TEST_USER_ID // O header é sempre do *usuário logado*
          }
        });
        
        if (!response.ok) {
          throw new Error('Falha ao buscar as receitas.');
        }
        
        const data: Recipe[] = await response.json();
        setRecipes(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, [activeTab]); // Re-executa quando 'activeTab' muda

  const handleTabClick = (tab: FeedTab) => {
    setActiveTab(tab);
    if (tab === 'minhas') {
      setFilterUserId(Number(TEST_USER_ID)); 
    }
    if (tab === 'geral') {
      setFilterUserId(null);
    }
  };

  return (
    <div className="feed-page"> 
      
      <div className="feed-tabs">
        <button 
          className={activeTab === 'geral' ? 'active' : ''}
          onClick={() => setActiveTab('geral')}
        >
          Geral
        </button>
        <button 
          className={activeTab === 'seguindo' ? 'active' : ''}
          onClick={() => setActiveTab('seguindo')}
        >
          Cozinheiros Favoritos
        </button>
        <button 
          className={activeTab === 'minhas' ? 'active' : ''}
          onClick={() => setActiveTab('minhas')}
        >
          Minhas Receitas
        </button>
      </div>

      {/* O resto da página (lista de receitas) */}
      <div className="feed-content">
        {loading && <div className="list-page-message">Carregando receitas...</div>}
        {error && <div className="list-page-message error">Erro: {error}</div>}
        
        {!loading && !error && recipes.length === 0 && (
          <div className="list-page-message">
            <p>Nenhuma receita encontrada nesta aba.</p>
          </div>
        )}
        
        {!loading && !error && (
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
    </div>
  );
}