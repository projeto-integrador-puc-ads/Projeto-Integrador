// API endpoints para a feature remember
// Exemplo inicial para integração com o backend

import { http } from '../../../lib/http';

export const getConquistas = async () => {
  return http.get('/remember/conquistas');
};

export const getDiarios = async () => {
  return http.get('/remember/diarios');
};

export const getLembrancas = async () => {
  return http.get('/remember/lembrancas');
};

export const getPerguntasCognitivas = async () => {
  return http.get('/remember/perguntas-cognitivas');
};

// Adicione outros endpoints conforme necessário
