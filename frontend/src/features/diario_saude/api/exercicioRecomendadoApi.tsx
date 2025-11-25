import http from "@/lib/http";

const base = "/api/diario_saude";

export interface ExercicioRecomendado {
  id: number;
  descricao: string;
  idPrescricao: number;
}

export const exercicioRecomendadoApi = {
  // GET: /api/diario_saude/exercicio-recomendado/prescricao/{prescricaoId}
  listar: async (prescricaoId: number): Promise<ExercicioRecomendado[]> => {
    const token = localStorage.getItem("token");
    const { data } = await http.get(
      `${base}/exercicio-recomendado/prescricao/${prescricaoId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return data ?? [];
  },

  // POST: /api/diario_saude/exercicio-recomendado (corpo: { idPrescricao, descricao })
  adicionar: async (prescricaoId: number, descricao: string) => {
    const token = localStorage.getItem("token");

    await http.post(
      `${base}/exercicio-recomendado`,
      {
        idPrescricao: prescricaoId,
        descricao: descricao,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
  },

  // DELETE: /api/diario_saude/exercicio-recomendado/{id}
  remover: async (id: number) => {
    const token = localStorage.getItem("token");

    await http.delete(`${base}/exercicio-recomendado/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
};