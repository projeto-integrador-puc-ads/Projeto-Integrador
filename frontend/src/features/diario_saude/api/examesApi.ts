import http from "@/lib/http";

export interface Exame {
    id_exame: number;
    nome_exame: string;
}

export const examesApi = {
    listar: async (): Promise<Exame[]> => {
        const resp = await http.get("/api/diario_saude/exames");
        return resp.data as Exame[];
    },
};