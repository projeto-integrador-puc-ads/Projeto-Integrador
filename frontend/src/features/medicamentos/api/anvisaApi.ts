// src/api/anvisaApi.ts (ou onde estiver)
import http from '@/lib/http';
export interface MedicamentoAnvisaDto { id: number; nomeProduto: string; }

export const anvisaApi = {
  listar: async (params?: { nome?: string; all?: boolean }) => {
    const { data } = await http.get<MedicamentoAnvisaDto[]>('/medicamentos/anvisa', {
      params: params ?? {}
    });
    return Array.isArray(data) ? data : [];
  },

  listarTodos: async () => {
    return anvisaApi.listar({ all: true });
  }
};
