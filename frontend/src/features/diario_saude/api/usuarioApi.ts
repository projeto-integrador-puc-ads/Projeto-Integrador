import http from "@/lib/http";
import type { Usuario } from "./types";

const base = "/api/diario_saude/usuario";

export const usuarioApi = {
  porId: async (id: number): Promise<Usuario> => {
    const { data } = await http.get(`${base}/${id}`, {
    });
    return data;
  },

  atualizar: async (payload: Usuario): Promise<Usuario> => {
    const { data } = await http.put(base, payload, {
    });
    return data;
  },

  listar: async (): Promise<Usuario[]> => {
    const { data } = await http.get(base);
    return Array.isArray(data) ? data : [];
  },
};
