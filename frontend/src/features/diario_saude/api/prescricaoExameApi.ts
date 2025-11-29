import http from "@/lib/http";

export interface PrescricaoExamePayload {
    id_exame: number;
    id_prescricao_medica: number;
    data_prescricao: string;
    observacao: string;
}

export interface PrescricaoExameResposta {
    id: number;
    id_exame: number;
    id_prescricao_medica: number;
}

export const prescricaoExameApi = {
    salvar: async (payload: PrescricaoExamePayload): Promise<PrescricaoExameResposta> => {
        const resp = await http.post("/api/diario_saude/prescricao/exame", payload);
        return resp.data as PrescricaoExameResposta;
    },
};