// API endpoints para a feature remember
// Exemplo inicial para integração com o backend

import http from "../../../lib/http";

export const getDiarios = async () => {
  return http.get("/remember/diarios");
};

export const getLembrancas = async () => {
  return http.get("/remember/lembrancas");
};

export const getConquistas = async () => {
  return http.get("/remember/conquistas");
};

export const getPerguntasCognitivas = async () => {
  return http.get("/remember/perguntas-cognitivas");
};

// Salvar novo diário
export const postDiario = async (data: {
  titulo: string;
  conteudo: string;
  identificadorUsuario: number;
}) => {
  // Ajuste o identificadorUsuario conforme a lógica de autenticação
  return http.post("/api/diarios", data);
};
