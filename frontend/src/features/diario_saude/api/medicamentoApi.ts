import http from "@/lib/http";
import type { Medicamento } from "./types";

const base = "/api/diario_saude/medicamentos";

export const medicamentoApi = {
  listar: async (): Promise<Medicamento[]> => {
    const token = localStorage.getItem("token");
    const { data } = await http.get(base, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return Array.isArray(data) ? data : [];
  },

  buscarPorId: async (id: number): Promise<Medicamento> => {
    const token = localStorage.getItem("token");
    const { data } = await http.get(`${base}/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  },
};
