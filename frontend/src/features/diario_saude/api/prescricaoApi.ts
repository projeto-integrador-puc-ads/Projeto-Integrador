import http from '@/lib/http';
import type { Prescricao } from './types';

const base = '/api/diario_saude/prescricao';

export const prescricaoApi = {
  porUsuario: async (idUsuario: number): Promise<Prescricao[]> => {

    const { data } = await http.get(`${base}/usuario/${idUsuario}`, {
    });

    return Array.isArray(data) ? data : [];
  },
};
