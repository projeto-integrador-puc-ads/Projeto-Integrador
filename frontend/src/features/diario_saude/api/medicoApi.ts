import http from "@/lib/http";
import type { Usuario } from "./types";

const base = "/api/diario_saude/medico";

export const medicoApi = {
  porId: async (id_medico: number): Promise<Usuario> => {
    const { data } = await http.get(`${base}/${id_medico}`);
    return data;
  },

  atualizar: async (payload: { id_medico: number; nome: string; local_trabalho: string }) => {

    const { data } = await http.put(base, payload);
  return data;
  },
};