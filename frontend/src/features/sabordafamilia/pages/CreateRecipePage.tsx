import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './FormPage.css'; // Usaremos um estilo de formulário genérico

export function CreateRecipePage() {
  // Estados para cada campo do formulário
  const [titulo, setTitulo] = useState('');
  const [ingredientes, setIngredientes] = useState('');
  const [modoPreparo, setModoPreparo] = useState('');
  const [historia, setHistoria] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  // Função para lidar com o envio do formulário
  const handleSaveRecipe = async (event: React.FormEvent) => {
    event.preventDefault(); // Impede o recarregamento padrão da página
    setIsSubmitting(true);
    setError(null);

    const newRecipeData = {
      titulo,
      ingredientes,
      modo_preparo: modoPreparo,
      historia_receita: historia,
    };

    try {
      // O backend usará o header X-User-Id para associar a receita ao autor
      const response = await fetch('/api/receitas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newRecipeData),
      });

      if (!response.ok) {
        throw new Error('Falha ao salvar a receita. Verifique os dados e tente novamente.');
      }

      alert('Receita salva com sucesso!');
      navigate('/'); // Redireciona para o feed após o sucesso
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="form-page">
      <h1>Cadastrar Nova Receita</h1>
      <form onSubmit={handleSaveRecipe} className="form-container">
        <div className="form-group">
          <label htmlFor="titulo">Título</label>
          <input
            id="titulo"
            type="text"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="ingredientes">Ingredientes</label>
          <textarea
            id="ingredientes"
            value={ingredientes}
            onChange={(e) => setIngredientes(e.target.value)}
            rows={5}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="modoPreparo">Modo de Preparo</label>
          <textarea
            id="modoPreparo"
            value={modoPreparo}
            onChange={(e) => setModoPreparo(e.target.value)}
            rows={8}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="historia">História da Receita (Opcional)</label>
          <textarea
            id="historia"
            value={historia}
            onChange={(e) => setHistoria(e.target.value)}
            rows={3}
          />
        </div>

        {error && <p className="form-error">{error}</p>}

        <button type="submit" disabled={isSubmitting} className="submit-button">
          {isSubmitting ? 'Salvando...' : 'Salvar Receita'}
        </button>
      </form>
    </div>
  );
}