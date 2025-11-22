// src/api/questionarioApi.ts
import http from "@/lib/http";
import type { Pergunta, Opcao, RespostaDTO } from "../api/types";

const base = "/api/diario_saude/questionario";

export const questionarioApi = {
  listarPerguntas: async (): Promise<Pergunta[]> => {
    const token = localStorage.getItem("token");

    const { data } = await http.get(`${base}/perguntas`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!Array.isArray(data)) return [];

    return data.map((p: any) => ({
      id: p.id,
      texto: p.texto,
      opcoes: Array.isArray(p.opcoes)
        ? p.opcoes.map((o: any) => ({
            texto: o.texto,
            peso: o.peso,
          }))
        : [],
    }));
  },

  enviarRespostas: async (usuarioId: number, respostas: RespostaDTO[]) => {
    const token = localStorage.getItem("token");

    const { data } = await http.post(
      `${base}/responder/${usuarioId}`,
      respostas,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    return data;
  },
};
