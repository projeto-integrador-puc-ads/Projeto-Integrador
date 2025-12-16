import http from '@/lib/http';

export interface MedicamentoAnvisa {
  id: number;
  nomeProduto: string;
}

export const medicamentosApi = {
  listarPorUsuario: async (usuarioId: number, anvisaId?: number): Promise<MedicamentoAnvisa[]> => {
    const params: any = { usuarioId };
    if (anvisaId) params.anvisaId = anvisaId;

    const { data } = await http.get<MedicamentoAnvisa[]>('/api/medicamentos', { params });
    return Array.isArray(data) ? data : [];
  }
};
