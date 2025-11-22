import http from '@/lib/http';

export type Prescricao = {
  id_prescricao: number;
  data_prescricao: string;
  nomeMedico: string;
  medicamentos: string[];
  exames: string[];
};

const base = '/api/diario_saude/prescricao';

export const prescricaoApi = {
  porUsuario: async (idUsuario: number): Promise<Prescricao[]> => {
    const token = localStorage.getItem('token');

    const { data } = await http.get(`${base}/usuario/${idUsuario}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Garantir que sempre retorna array
    return Array.isArray(data) ? data : [];
  },
};
