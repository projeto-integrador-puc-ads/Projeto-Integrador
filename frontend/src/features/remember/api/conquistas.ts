import http from '@/lib/http';

export interface Conquista {
    identificadorConquista: number;
    nome: string;
    descricao: string;
    meta: number;
    pontos: number;
    tipo: string;
    icone: string;
}

export interface CreateConquistaPayload {
    nome: string;
    descricao: string;
    meta: number;
    pontos: number;
    tipo: number;
    icone: string;
}

export interface UpdateConquistaPayload {
    nome: string;
    descricao: string;
}

export const adminConquistasApi = {
    listar: async (): Promise<Conquista[]> => {
        const { data } = await http.get<Conquista[]>('/api/conquistas', {
            timeout: 0,
            maxBodyLength: Infinity,
            maxContentLength: Infinity
        });
        return data;
    },
    criar: async (payload: CreateConquistaPayload): Promise<Conquista> => {
        const { data } = await http.post<Conquista>('/api/conquistas', payload);
        return data;
    },
    porId: async (id: number): Promise<Conquista> => {
        const { data } = await http.get<Conquista>(`/api/conquistas/${id}`);
        return data;
    },
    atualizar: async (id: number, payload: UpdateConquistaPayload): Promise<Conquista> => {
        const { data } = await http.put<Conquista>(`/api/conquistas/${id}`, payload);
        return data;
    },
    remover: async (id: number): Promise<void> => {
        await http.delete(`/api/conquistas/${id}`);
    },
};