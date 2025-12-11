import http from '@/lib/http';
import type {Conquista} from "@/features/remember/api/conquistas.ts";

export interface Lembranca {
    identificadorLembranca: number;
    identificadorUsuario: number;
    titulo: string;
    dataAcontecimento: string;
    pessoasPresentes: string;
    local: string;
    historia: string;
    imagem?: string;
    dataCriacao: string;
    dataAtualizacao: string;
    conquistasDesbloqueadas?: Conquista[];
}


export interface CreateLembrancaPayload {
    identificadorUsuario: number;
    titulo: string;
    dataAcontecimento: string;
    pessoasPresentes: string;
    local: string;
    historia: string;
    imagem?: string;
}

export interface UpdateLembrancaPayload {
    titulo: string;
    dataAcontecimento: string;
    pessoasPresentes: string;
    local: string;
    historia: string;
    imagem?: string;
}

export const lembrancasApi = {
    listarPorUsuario: async (usuarioId: number): Promise<Lembranca[]> => {
        const { data } = await http.get<Lembranca[]>(`/api/lembrancas/usuario/${usuarioId}`, {
            timeout: 0,
            maxBodyLength: Infinity,
            maxContentLength: Infinity
        });
        return data;
    },
    porId: async (id: number): Promise<Lembranca> => {
        const { data } = await http.get<Lembranca>(`/api/lembrancas/${id}`);
        return data;
    },
    criar: async (payload: CreateLembrancaPayload): Promise<Lembranca> => {
        const { data } = await http.post<Lembranca>('/api/lembrancas', payload, {
            timeout: 0,
            maxBodyLength: Infinity,
            maxContentLength: Infinity
        });
        return data;
    },
    atualizar: async (id: number, payload: UpdateLembrancaPayload): Promise<Lembranca> => {
        const { data } = await http.put<Lembranca>(`/api/lembrancas/${id}`, payload);
        return data;
    },
    remover: async (id: number): Promise<void> => {
        await http.delete(`/api/lembrancas/${id}`);
    }
};