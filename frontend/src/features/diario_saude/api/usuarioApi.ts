import http from "@/lib/http";
import type { Usuario } from "./types";

const base = "/api/diario_saude/usuario";

export const usuarioApi = {
  porId: async (id: number): Promise<Usuario> => {
    const token = localStorage.getItem("token");
    const { data } = await http.get(`${base}/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  },

  atualizar: async (payload: Usuario): Promise<Usuario> => {
    const token = localStorage.getItem("token");
    const { data } = await http.put(base, payload, {
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    });
    return data;
  },
};
