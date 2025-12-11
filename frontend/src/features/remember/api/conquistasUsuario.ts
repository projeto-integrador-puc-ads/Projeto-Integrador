import http from '@/lib/http';

export interface ConquistaDetalhes {
    identificadorConquista: number;
    nome: string;
    descricao: string;
    pontos: number;
    icone: string;
    tipo: string;
    meta: number;
}

export interface UsuarioConquistaDTO {
    identificadorUsuario: number;
    dataObtencao: string | null;
    conquista: ConquistaDetalhes;
}

export interface RankingItem {
    nomeUsuario: string;
    totalPontos: number;
}

export const conquistasUsuarioApi = {
    listarProgresso: async (usuarioId: number): Promise<UsuarioConquistaDTO[]> => {
        const { data } = await http.get<UsuarioConquistaDTO[]>(`/api/usuario-conquistas/${usuarioId}`);
        return data;
    },
    buscarRanking: async (): Promise<RankingItem[]> => {
        const { data } = await http.get<RankingItem[]>('/api/usuario-conquistas/ranking');
        return data;
    }
};