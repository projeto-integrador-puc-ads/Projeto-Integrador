import http from "@/lib/http";
import type { Doenca } from "./types";

const base = "/api/diario_saude/doencas";

export const doencaApi = {
  listar: async (): Promise<Doenca[]> => {
    const { data } = await http.get(`${base}/listar`, {
    });
    return Array.isArray(data) ? data : [];
  },
};
