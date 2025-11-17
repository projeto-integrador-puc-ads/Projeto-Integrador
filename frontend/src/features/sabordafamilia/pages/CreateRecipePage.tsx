import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Recipe } from '../../../shared/types/Recipe';
import './FormPage.css'; 

// --- SIMULAÇÃO DE LOGIN ---
const TEST_USER_ID = '1'; 
// -------------------------

export function CreateRecipePage() {
  const [titulo, setTitulo] = useState('');
  const [ingredientes, setIngredientes] = useState('');
  const [modoPreparo, setModoPreparo] = useState('');
  const [historia, setHistoria] = useState('');
  const [imagem, setImagem] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const [tipoRefeicao, setTipoRefeicao] = useState('Lanche'); //
  const [temGluten, setTemGluten] = useState(false);
  const [temLactose, setTemLactose] = useState(false);
  const [temAcucar, setTemAcucar] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const navigate = useNavigate();

  const handleImagemChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImagem(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSaveRecipe = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const newRecipeData = {
      titulo,
      ingredientes,
      modoPreparo,
      historiaReceita: historia,
      tipoRefeicao: tipoRefeicao, 
      restricoes: {              
        temGluten: temGluten,
        temLactose: temLactose,
        temAcucar: temAcucar
      }
    };

    try {
      // Etapa 1: Enviar os dados de TEXTO (JSON)
      const response = await fetch('/api/sabordafamilia/receitas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': TEST_USER_ID
        },
        body: JSON.stringify(newRecipeData),
      });

      if (!response.ok) {
        const errorBody = await response.json();
        throw new Error(errorBody.detail || 'Falha ao salvar os dados da receita.');
      }

      const receitaSalva: Recipe = await response.json();

      // Etapa 2: Se uma imagem foi selecionada, fazer o upload dela
      if (imagem) {
        const formData = new FormData();
        formData.append('file', imagem); 
        formData.append('tipo_midia', 'foto'); 

        const imageResponse = await fetch(`/api/sabordafamilia/receitas/${receitaSalva.id}/midia`, {
          method: 'POST',
          headers: {
            'X-User-Id': TEST_USER_ID
          },
          body: formData,
        });

        if (!imageResponse.ok) {
          throw new Error('Receita salva, mas falha ao enviar a imagem.');
        }
      }

      alert('Receita salva com sucesso!');
      navigate('/'); // Redireciona para o feed
      
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="form-page">
      <h1>Cadastrar Nova Receita</h1>
      
      <form onSubmit={handleSaveRecipe} className="form-wrapper">
        <div className="form-columns-container">

          {/* --- COLUNA DA ESQUERDA (IMAGEM) --- */}
          <div className="form-column-left">
            <div className="form-group">
              <label htmlFor="imagem">Foto da Receita</label>
              <input id="imagem" type="file" accept="image/png, image/jpeg" onChange={handleImagemChange} className="file-input-field" />
              <label htmlFor="imagem" className="file-input-label">
                Escolher arquivo...
              </label>
              {imagem && <span className="file-name">{imagem.name}</span>}
              
              {preview ? (
                <img src={preview} alt="Preview" className="image-preview" />
              ) : (
                <div className="image-placeholder">
                  <span>📷</span>
                  <p>A foto da sua receita aparecerá aqui</p>
                </div>
              )}
            </div>
          </div>
          
          {/* --- COLUNA DA DIREITA (INFORMAÇÕES) --- */}
          <div className="form-column-right">
            <div className="form-group">
              <label htmlFor="titulo">Título</label>
              <input id="titulo" type="text" value={titulo} onChange={(e) => setTitulo(e.target.value)} required />
            </div>

            <div className="form-group">
              <label htmlFor="tipoRefeicao">Tipo de Refeição</label>
              <select 
                id="tipoRefeicao" 
                value={tipoRefeicao} 
                onChange={(e) => setTipoRefeicao(e.target.value)}
                className="select-field"
              >
                <option value="Lanche">Lanche</option>
                <option value="Almoço">Almoço</option>
                <option value="Jantar">Jantar</option>
                <option value="Sobremesa">Sobremesa</option>
                <option value="Café da Manhã">Café da Manhã</option>
              </select>
            </div>

            <div className="form-group">
              <label>Restrições Alimentares</label>
              <div className="checkbox-group">
                <label className="checkbox-label">
                  <input type="checkbox" checked={temGluten} onChange={(e) => setTemGluten(e.target.checked)} />
                  <span>Contém Glúten</span>
                </label>
                <label className="checkbox-label">
                  <input type="checkbox" checked={temLactose} onChange={(e) => setTemLactose(e.target.checked)} />
                  <span>Contém Lactose</span>
                </label>
                <label className="checkbox-label">
                  <input type="checkbox" checked={temAcucar} onChange={(e) => setTemAcucar(e.target.checked)} />
                  <span>Contém Açúcar</span>
                </label>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="ingredientes">Ingredientes</label>
              <textarea id="ingredientes" value={ingredientes} onChange={(e) => setIngredientes(e.target.value)} rows={5} required />
            </div>
            <div className="form-group">
              <label htmlFor="modoPreparo">Modo de Preparo</label>
              <textarea id="modoPreparo" value={modoPreparo} onChange={(e) => setModoPreparo(e.target.value)} rows={8} required />
            </div>
            <div className="form-group">
              <label htmlFor="historia">História da Receita (Opcional)</label>
              <textarea id="historia" value={historia} onChange={(e) => setHistoria(e.target.value)} rows={3} />
            </div>
          </div>
        </div>

        {error && <p className="form-error">{error}</p>}
        
        <button type="submit" disabled={isSubmitting} className="submit-button">
          {isSubmitting ? 'Salvando...' : 'Salvar Receita'}
        </button>
      </form>
    </div>
  );
}