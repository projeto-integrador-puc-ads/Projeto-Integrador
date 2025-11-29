import http from "@/lib/http";
import type { UsuarioDoenca } from "./types";

const base = "/api/diario_saude/usuario-doenca";

export const usuarioDoencaApi = {
  listar: async (usuarioId: number): Promise<UsuarioDoenca[]> => {
    const { data } = await http.get(`${base}/usuario/${usuarioId}`, {
    });
    return Array.isArray(data) ? data : [];
  },

  adicionar: async (usuarioId: number, doencaId: number): Promise<UsuarioDoenca> => {
    const { data } = await http.post(
      `${base}/add?usuarioId=${usuarioId}&doencaId=${doencaId}`,
      null,
    );
    return data;
  },

  remover: async (usuarioId: number, doencaId: number): Promise<void> => {
    await http.delete(`${base}/delete?usuarioId=${usuarioId}&doencaId=${doencaId}`, {
    });
  },
};
