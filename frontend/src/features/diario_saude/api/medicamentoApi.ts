import http from "@/lib/http";
import type { Medicamento } from "./types";

const base = "/api/diario_saude/medicamentos";

export const medicamentoApi = {
  listar: async (): Promise<Medicamento[]> => {
    const { data } = await http.get(base, {
    });
    return Array.isArray(data) ? data : [];
  },

  buscarPorId: async (id: number): Promise<Medicamento> => {
    const { data } = await http.get(`${base}/${id}`, {
    });
    return data;
  },
};
