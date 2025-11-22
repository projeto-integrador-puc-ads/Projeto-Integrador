import http from "@/lib/http";
import type { PrescricaoMedicamento, Medicamento } from "./types";

const base = "/api/diario_saude/prescricao_medicamento";

export const prescricaoMedicamentoApi = {
  listar: async (prescricaoId: number): Promise<PrescricaoMedicamento[]> => {
    const token = localStorage.getItem("token");
    const { data } = await http.get(`${base}/prescricao/${prescricaoId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return Array.isArray(data) ? data : [];
  },

  adicionar: async (
    prescricaoId: number,
    med: Medicamento & { concentracao: string; via: string; dosagem: string; frequencia: string }
  ): Promise<PrescricaoMedicamento> => {
    const token = localStorage.getItem("token");
    const payload = {
      id_prescricao: prescricaoId,
      id_medicamento: med.id_medicamento || null,
      nome_medicamento: med.nome,
      principio_ativo: med.principio_ativo,
      concentracao: med.concentracao,
      via: med.via,
      dosagem: med.dosagem,
      frequencia: med.frequencia,
    };

    const { data } = await http.post(base, payload, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data as PrescricaoMedicamento;
  },

  remover: async (id_prescricao_medicamento: number) => {
    const token = localStorage.getItem("token");
    await http.delete(`${base}/${id_prescricao_medicamento}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
};
