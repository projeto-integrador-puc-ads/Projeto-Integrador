import http from "@/lib/http";
import type { Pergunta, Opcao, RespostaDTO } from "../api/types";

const base = "/api/diario_saude/questionario";

export const questionarioApi = {
  listarPerguntas: async (): Promise<Pergunta[]> => {
    const { data } = await http.get(`${base}/perguntas`, {
    });

    if (!Array.isArray(data)) return [];

    return data.map((p: any) => ({
      id: p.id,
      texto: p.texto,
      opcoes: Array.isArray(p.opcoes)
        ? p.opcoes.map((o: any) => ({ texto: o.texto, peso: o.peso }))
        : [],
    }));
  },

  enviarRespostas: async (usuarioId: number, respostas: RespostaDTO[]) => {
    const token = localStorage.getItem("token");
    const { data } = await http.post(`${base}/responder/${usuarioId}`, respostas, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  },

  obterRespostas: async (
    usuarioId: number
  ): Promise<(RespostaDTO & { pergunta: Pergunta })[]> => {
    const { data } = await http.get(`${base}/respostas/${usuarioId}`, {
    });

    return Array.isArray(data)
      ? data.map((r: any) => ({
          perguntaId: r.pergunta?.id,
          resposta: r.resposta,
          peso: r.peso,
          // mantém o objeto pergunta completo
          pergunta: r.pergunta
            ? {
                id: r.pergunta.id,
                texto: r.pergunta.texto,
                opcoes: Array.isArray(r.pergunta.opcoes)
                  ? r.pergunta.opcoes.map((o: any) => ({ texto: o.texto, peso: o.peso }))
                  : [],
              }
            : { id: 0, texto: "Pergunta não encontrada", opcoes: [] }, // fallback
        }))
      : [];
  },
};
