import http from "@/lib/http";
import type { UsuarioAlergia } from "./types";

const base = "/api/diario_saude";

export const usuarioAlergiaApi = {
  listar: async (usuarioId: number): Promise<UsuarioAlergia[]> => {
    const token = localStorage.getItem("token");
    const { data } = await http.get(`${base}/usuario-alergia/usuario/${usuarioId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data ?? [];
  },

  adicionar: async (usuarioId: number, alergiaId: number) => {
    const token = localStorage.getItem("token");
    await http.post(
      `${base}/usuario-alergia/add`,
      null,
      {
        params: { usuarioId, alergiaId },
        headers: { Authorization: `Bearer ${token}` },
      }
    );
  },

  remover: async (usuarioId: number, alergiaId: number) => {
    const token = localStorage.getItem("token");
    await http.delete(`${base}/usuario-alergia/delete`, {
      params: { usuarioId, alergiaId },
      headers: { Authorization: `Bearer ${token}` },
    });
  },
};
