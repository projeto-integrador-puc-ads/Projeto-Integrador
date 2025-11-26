// Tipos para a feature remember

export interface Conquista {
  id: number;
  nome: string;
  descricao: string;
}

export interface Diario {
  id: number;
  titulo: string;
  conteudo: string;
  data: string;
}

export interface Lembranca {
  id: number;
  titulo: string;
  descricao: string;
  data: string;
}


/**
 * Representa a definição estática de uma conquista.
 */
export interface ConquistaDTO {
  nome: string;
  descricao: string;
  iconeUrl: string;
  pontos: number;
  meta: number;
  tipo: number;
  imagem: string;
}

export interface PerguntaCognitiva {
  id: number;
  pergunta: string;
  resposta: string;
}
// Adicione outros tipos conforme necessário
