import http from "@/lib/http";
import type { Doenca } from "./types";

const base = "/api/diario_saude/doencas";

export const doencaApi = {
  listar: async (): Promise<Doenca[]> => {
    const token = localStorage.getItem("token");
    const { data } = await http.get(`${base}/listar`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return Array.isArray(data) ? data : [];
  },
};
