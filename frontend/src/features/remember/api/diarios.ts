import http from '@/lib/http';
import type {Conquista} from "@/features/remember/api/conquistas.ts";

export interface Diario {
    identificadorDiario: number;
    identificadorUsuario: number;
    titulo: string;
    conteudo: string;
    dataEscrita: string;
    dataCriacao: string;
    dataAtualizacao: string;
    conquistasDesbloqueadas?: Conquista[];
}

export interface CreateDiarioPayload {
    identificadorUsuario: number;
    titulo: string;
    conteudo: string;
    dataEscrita: string;
}

export interface UpdateDiarioPayload {
    titulo: string;
    conteudo: string;
}

export const diariosApi = {
    listarPorUsuario: async (usuarioId: number): Promise<Diario[]> => {
        const { data } = await http.get<Diario[]>(`/api/diarios/usuario/${usuarioId}`);
        return data;
    },
    criar: async (payload: CreateDiarioPayload): Promise<Diario> => {
        const { data } = await http.post<Diario>('/api/diarios', payload);
        return data;
    },
    atualizar: async (id: number, payload: UpdateDiarioPayload): Promise<Diario> => {
        const { data } = await http.put<Diario>(`/api/diarios/${id}`, payload);
        return data;
    },
    remover: async (id: number): Promise<void> => {
        await http.delete(`/api/diarios/${id}`);
    }
};