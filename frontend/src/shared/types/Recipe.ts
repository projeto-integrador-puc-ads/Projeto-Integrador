export type Usuario = {
  id: number;
  nome: string;
  // Adicione outros campos de usuário se necessário (ex: fotoPerfil)
};

export type Midia = {
  id: number;
  caminhoArquivo: string;
  tipoMidia: string;
};

export type Restricoes = {
  id: number;
  temGluten: boolean;
  temLactose: boolean;
  temAcucar: boolean;
};

// --- A INTERFACE PRINCIPAL ---
// Esta é a definição de tipo de Receita que o frontend espera.
export type Recipe = {
  id: number;
  titulo: string;
  ingredientes: string;
  modoPreparo: string;
  historiaReceita?: string;
  tipoRefeicao?: string;
  autor: Usuario;
  midias: Midia[];
  restricoes?: Restricoes;
  usuariosFavoritaram?: Usuario[]; // Necessário para a lógica de favoritos

  contagemCurtidas: number; // <-- O novo campo obrigatório
};