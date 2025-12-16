import http from "@/lib/http";

export interface CreateMedicamentoPayload {
  usuarioId: number;                // obrigatório
  totalFrasco?: number;
  quantidadeCartela?: number;
  doseDiaria: number;
  tipoDosagem: string;
  tarja: string;
  horarios: { horario: string }[];
  contatoEmergenciaId?: number;     // opcional
}

export const medicamentosApi = {
  criar: async (
    payload: CreateMedicamentoPayload,
    anvisaId: number
  ) => {
    const { data } = await http.post(
      `/api/medicamentos?anvisaId=${anvisaId}`,
      payload
    );

    return data;
  },
};
