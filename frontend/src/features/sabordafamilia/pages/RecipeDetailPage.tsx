import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { Comentario } from '../../../shared/types/Comentario';
import './RecipeDetailPage.css'; 
import { NarradorButton } from '../components/NarradorButton'; // <-- Importando o componente corretamente

// --- DEFINIÇÕES DE TIPO ---
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

type Recipe = {
  id: number;
  titulo: string;
  ingredientes: string;
  modoPreparo: string;
  historiaReceita?: string;
  tipoRefeicao?: string;
  autor: Usuario;
  midias: Midia[];
  restricoes?: Restricoes;
  contagemCurtidas: number;
  isCurtidaPeloUsuarioAtual: boolean;
  // Fallback opcional caso o JSON venha sem o "is" (segurança extra)
  curtidaPeloUsuarioAtual?: boolean; 
};

// --- DEFINIÇÕES GLOBAIS ---
const API_BASE_URL = 'http://localhost:8080';
const TEST_USER_ID = '1'; 

export function RecipeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [comments, setComments] = useState<Comentario[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Estados de interação
  const [isFavorited, setIsFavorited] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const [textoNarrador, setTextoNarrador] = useState('');

  const fetchRecipeDetails = async () => {
    if (!id) return;
    try {
      setLoading(true);
      setError(null);
      
      const recipeUrl = `${API_BASE_URL}/api/sabordafamilia/receitas/${id}`;
      const commentsUrl = `${API_BASE_URL}/api/sabordafamilia/receitas/${id}/comentarios`;
      const favoritesUrl = `${API_BASE_URL}/api/sabordafamilia/usuarios/me/favoritos`; 

      // Busca tudo em paralelo
      const [recipeResponse, favoritesResponse, commentsResponse] = await Promise.all([
        // cache: 'no-store' é crucial para evitar dados obsoletos de curtida
        fetch(recipeUrl, {
          headers: { 'X-User-Id': TEST_USER_ID },
          cache: 'no-store' 
        }),
        fetch(favoritesUrl, {
          headers: { 'X-User-Id': TEST_USER_ID },
          cache: 'no-store'
        }),
        fetch(commentsUrl, {
             cache: 'no-store'
        })
      ]);

      if (!recipeResponse.ok) throw new Error('Receita não encontrada.');
      const recipeData: Recipe = await recipeResponse.json();
      setRecipe(recipeData);

      // Lógica de Favorito
      let isFav = false;
      if (favoritesResponse.ok) {
        const favoritesData: Recipe[] = await favoritesResponse.json();
        if (favoritesData.some(favRecipe => favRecipe.id === recipeData.id)) {
          isFav = true;
        }
      }
      setIsFavorited(isFav);
      
      // --- LÓGICA DE CURTIDA ---
      // Verifica ambas as possibilidades de nome (com 'is' ou sem 'is') para garantir
      const curtiu = recipeData.isCurtidaPeloUsuarioAtual !== undefined 
          ? recipeData.isCurtidaPeloUsuarioAtual 
          : (recipeData.curtidaPeloUsuarioAtual || false);

      setIsLiked(curtiu);
      
      if (commentsResponse.ok) {
        const commentsData: Comentario[] = await commentsResponse.json();
        setComments(commentsData);
      }

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipeDetails();
  }, [id]);

  // Monta o texto do narrador
  useEffect(() => {
    if (recipe) {
      const partes = [];
      partes.push(`Título: ${recipe.titulo}`);
      partes.push(`Por: ${recipe.autor.nome}`);
      
      if (recipe.tipoRefeicao) partes.push(`Tipo de refeição: ${recipe.tipoRefeicao}`);
      
      const restricoesTxt: string[] = [];
      if (recipe.restricoes?.temGluten) restricoesTxt.push("Contém Glúten");
      if (recipe.restricoes?.temLactose) restricoesTxt.push("Contém Lactose");
      if (recipe.restricoes?.temAcucar) restricoesTxt.push("Contém Açúcar");
      
      if (restricoesTxt.length > 0) {
        partes.push(`Restrições: ${restricoesTxt.join(', ')}.`);
      } else {
        partes.push("Sem restrições comuns identificadas.");
      }
  
      partes.push(`Ingredientes: ${recipe.ingredientes}`);
      partes.push(`Modo de Preparo: ${recipe.modoPreparo}`);
      
      if (recipe.historiaReceita) {
        partes.push(`História da receita: ${recipe.historiaReceita}`);
      }
      
      setTextoNarrador(partes.join('. \n\n '));
    }
  }, [recipe]);

  const handleAddComment = async () => {
    if (newComment.trim() === '' || !recipe || isSubmitting) return;
    setIsSubmitting(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/sabordafamilia/receitas/${recipe.id}/comentarios`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'X-User-Id': TEST_USER_ID 
        },
        body: JSON.stringify({ texto: newComment }),
      });

      if (response.ok) {
        const addedComment: Comentario = await response.json();
        setComments([...comments, addedComment]);
        setNewComment('');
      } else {
        console.error('Erro ao enviar comentário.');
      }
    } catch (error) {
      console.error('Falha ao adicionar comentário:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
 const handleLike = async () => {
    if (!recipe || isSubmitting) return;

    const estadoOriginalLike = isLiked;
    const contagemOriginal = recipe.contagemCurtidas;
    
    const novoEstadoLike = !isLiked;
    // Ajuste visual: se curtiu agora, soma 1. Se descurtiu, subtrai 1.
    const novaContagem = novoEstadoLike ? contagemOriginal + 1 : contagemOriginal - 1;

    // Atualiza UI (Otimista)
    setIsLiked(novoEstadoLike);
    setRecipe({ ...recipe, contagemCurtidas: novaContagem });
    setIsSubmitting(true);
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/sabordafamilia/receitas/${recipe.id}/curtidas`, {
        method: 'POST',
        headers: { 'X-User-Id': TEST_USER_ID }
      });
      
      if (!response.ok) throw new Error("Falha ao processar a curtida");
      
    } catch (error) {
      console.error('Falha ao curtir:', error);
      // Reverte em caso de erro
      setIsLiked(estadoOriginalLike);
      setRecipe({ ...recipe, contagemCurtidas: contagemOriginal });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleFavorite = async () => {
    if (!recipe || isSubmitting) return;
    
    setIsSubmitting(true);
    const novoEstadoFavorito = !isFavorited;
    setIsFavorited(novoEstadoFavorito);

    try {
      await fetch(`${API_BASE_URL}/api/sabordafamilia/usuarios/me/favoritos/${recipe.id}`, {
        method: 'POST',
        headers: { 'X-User-Id': TEST_USER_ID }
      });
    } catch (error) {
      console.error('Falha ao favoritar:', error);
      setIsFavorited(!novoEstadoFavorito);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAuthorClick = () => {
    if (recipe && recipe.autor) {
      navigate(`/perfil/${recipe.autor.id}`);
    }
  };

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>Erro: {error}</div>;
  if (!recipe) return <div>Receita não encontrada.</div>;

  const imageUrl = recipe.midias && recipe.midias.length > 0
    ? `${API_BASE_URL}/uploads/${recipe.midias[0].caminhoArquivo}`
    : 'https://placehold.co/600x400/f0e0d0/555?text=Receita';

  return (
    <> 
      <div className="detail-columns-container">
        
        <div className="detail-column-left">
          <h1>{recipe.titulo}</h1>
          <img 
            src={imageUrl} 
            alt={recipe.titulo} 
            className="recipe-detail-image"
            onError={(e) => (e.currentTarget.src = 'https://placehold.co/600x400/f0e0d0/555?text=Receita')}
          />
          
          <div className="author-action-container">
            <button 
              className="action-button author-button" 
              onClick={handleAuthorClick}
            >
               👤 Ver Perfil de {recipe.autor.nome}
            </button>
          </div>

          
          <div className="recipe-metadata">
            {recipe.tipoRefeicao && (
              <span className="meta-item tipo-refeicao">{recipe.tipoRefeicao}</span>
            )}
            <div className="meta-item restricoes">
              {recipe.restricoes?.temGluten && <span>🚫 Glúten</span>}
              {recipe.restricoes?.temLactose && <span>🚫 Lactose</span>}
              {recipe.restricoes?.temAcucar && <span>🚫 Açúcar</span>}
              {!recipe.restricoes?.temGluten && !recipe.restricoes?.temLactose && !recipe.restricoes?.temAcucar && (
                <span>✔️ Sem restrições comuns</span>
              )}
            </div>
          </div>

          <div className="recipe-actions-detail">
            <button 
              onClick={handleLike} 
              disabled={isSubmitting} 
              className={`action-button like-button ${isLiked ? 'liked' : ''}`}
            >
              {isLiked ? '❤️ Curtido!' : '❤️ Curtir'} ({recipe.contagemCurtidas})
            </button>
            <button 
              onClick={handleFavorite} 
              disabled={isSubmitting} 
              className={`action-button favorite-button ${isFavorited ? 'favorited' : ''}`}
            >
              {isFavorited ? '⭐ Favoritado!' : '⭐ Favoritar'}
            </button>
          </div>
        </div>

        <div className="detail-column-right">
          <div className="recipe-info">
            <h3>Ingredientes</h3>
            <pre className="recipe-block">{recipe.ingredientes}</pre>
            <h3>Modo de Preparo</h3>
            <pre className="recipe-block">{recipe.modoPreparo}</pre>
            {recipe.historiaReceita && (
              <>
                <h3>História da Receita</h3>
                <pre className="recipe-block story">{recipe.historiaReceita}</pre>
              </>
            )}
          </div>
          
          <div className="comments-section">
            <h2>Comentários</h2>
            <div className="comments-list">
              {comments.map(comment => (
                <div key={comment.id} className="comment">
                  <strong>{comment.usuario?.nome || 'Usuário'}:</strong>
                  <p>{comment.texto}</p>
                </div>
              ))}
              {comments.length === 0 && <p>Seja o primeiro a comentar!</p>}
            </div>
            <div className="add-comment">
              <h3>Deixe seu comentário</h3>
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Escreva um comentário..."
              />
              <button onClick={handleAddComment} disabled={isSubmitting}>
                {isSubmitting ? 'Enviando...' : 'Enviar Comentário'}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Renderiza o botão narrador usando o componente importado */}
      {recipe && textoNarrador && <NarradorButton textoParaLer={textoNarrador} />}
    </>
  );
}