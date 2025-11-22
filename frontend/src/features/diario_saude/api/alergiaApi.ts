import http from "@/lib/http";
import type { Alergia } from "./types";

const base = "/api/diario_saude";

export const alergiaApi = {
  listarSistema: async (): Promise<Alergia[]> => {
    const token = localStorage.getItem("token");
    const { data } = await http.get(`${base}/alergia/listar`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return Array.isArray(data) ? data : [];
  },
};
