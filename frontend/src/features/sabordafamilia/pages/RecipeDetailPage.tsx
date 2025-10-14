import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Recipe } from '../../../shared/types/Recipe';
import { Comentario } from '../../../shared/types/Comentario'; // Precisaremos criar este tipo
import './RecipeDetailPage.css'; // Estilo para a página

export function RecipeDetailPage() {
  // useParams pega os parâmetros da URL, como o 'id'
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [comments, setComments] = useState<Comentario[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Busca os dados da receita e os comentários quando a página carrega
  useEffect(() => {
    if (!id) return;

    const fetchRecipeDetails = async () => {
      try {
        setLoading(true);
        // Busca os dados da receita
        const recipeResponse = await fetch(`/api/receitas/${id}`);
        if (!recipeResponse.ok) throw new Error('Receita não encontrada.');
        const recipeData: Recipe = await recipeResponse.json();
        setRecipe(recipeData);

        // Busca os comentários da receita
        const commentsResponse = await fetch(`/api/receitas/${id}/comentarios`);
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

    fetchRecipeDetails();
  }, [id]); // Executa novamente se o 'id' na URL mudar

  // Função para enviar um novo comentário para a API
  const handleAddComment = async () => {
    if (newComment.trim() === '' || !recipe) return;

    try {
      // O 'X-User-Id' será adicionado por um interceptor global no futuro
      const response = await fetch(`/api/receitas/${recipe.id}/comentarios`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ texto: newComment }),
      });

      if (response.ok) {
        const addedComment: Comentario = await response.json();
        setComments([...comments, addedComment]); // Adiciona o novo comentário à lista
        setNewComment(''); // Limpa o campo
      } else {
        alert('Erro ao enviar comentário.');
      }
    } catch (error) {
      console.error('Falha ao adicionar comentário:', error);
    }
  };
  
  // Funções para curtir/favoritar (irão chamar a API)
  const handleLike = () => { /* Lógica POST /api/receitas/{id}/curtidas */ };
  const handleFavorite = () => { /* Lógica POST /api/usuarios/me/favoritos/{id} */ };


  if (loading) return <div>Carregando...</div>;
  if (error) return <div>Erro: {error}</div>;
  if (!recipe) return <div>Receita não encontrada.</div>;

  return (
    <div className="recipe-detail-page">
      <button onClick={() => navigate(-1)} className="back-button">← Voltar</button>
      
      <h1>{recipe.titulo}</h1>
      
      <img src={recipe.midias?.[0]?.caminhoArquivo || '/default-recipe-image.jpg'} alt={recipe.titulo} className="recipe-detail-image" />

      <div className="recipe-info">
        <p><strong>Autor:</strong> {recipe.autor.nome}</p>
        <p><strong>Ingredientes:</strong> {recipe.ingredientes}</p>
        <p><strong>Modo de Preparo:</strong> {recipe.modoPreparo}</p>
        {recipe.historiaReceita && <p><strong>História:</strong> {recipe.historiaReceita}</p>}
      </div>

      <div className="recipe-actions-detail">
          <button onClick={handleLike}>❤️ {recipe.curtidas} Curtidas</button>
          <button onClick={handleFavorite}>⭐ Favoritar</button>
          {/* Lógica de compartilhar pode ser a mesma do RecipeCard */}
      </div>

      <div className="comments-section">
        <h2>Comentários</h2>
        <div className="comments-list">
          {comments.map(comment => (
            <div key={comment.id} className="comment">
              <strong>{comment.usuario.nome}:</strong>
              <p>{comment.texto}</p>
            </div>
          ))}
        </div>
        <div className="add-comment">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Escreva um comentário..."
          />
          <button onClick={handleAddComment}>Enviar</button>
        </div>
      </div>
    </div>
  );
}