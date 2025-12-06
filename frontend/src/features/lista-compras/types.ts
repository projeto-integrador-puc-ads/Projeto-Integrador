// src/features/lista-compras/types.ts

export type Produto = {
    id: number;
    nome: string;
    nome_normalizado: string;
    ativo: boolean;
    is_personalizado: boolean;
    // tags?: string[];
};

export type ListaItemVM = {
    produto: Produto;
    qtd: number;
};

export type Template = {
    id: number;
    titulo: string;
    is_template: boolean;
    itens: { produto_id: number; qtd: number }[];
};

export type Patologia = {
    id: number;
    nome: string;
};

export type NivelRisco = 'baixa' | 'media' | 'alta';

export type PatologiaItem = {
    patologia_id: number;
    produto_id: number;
    nivel?: NivelRisco;
};

export interface PatologiaDTO {
    id: number;
    nome: string;
    descricao?: string;
}

export interface ProdutoSugestaoDTO {
    id: number;
    nome: string;
    nomeNormalizado?: string;
    preco?: number;
    ativo?: boolean;
    isPersonalizado?: boolean;
    tags?: string;
}

export interface ProdutoSubstituivel {
    produtoAlertadoId: number;
    produtoAlertadoNome: string;
    patologia: PatologiaDTO;
    produtoSugestao: ProdutoSugestaoDTO | null;
}




export interface ListaDTO {
    id: number;
    titulo: string;
    usuarioId?: number;
    usuarioNome?: string;
    patologiaId?: number | null;
    template?: boolean;
    createdAt: string;
    descricao?: string | null;
    status?: string | null;
    itens?: {
        produtoId: number;
        quantidade: number;
        produto: {
            id: number;
            nome: string;
            nomeNormalizado?: string;
            ativo?: boolean;
            isPersonalizado?: boolean;
        };
    }[];
}

// src/features/lista-compras/api/service/patologiasService.ts


import type { Patologia} from '@/features/lista-compras/types.ts';
import { listaComprasApi } from '@/features/lista-compras/api/http.ts';



export const patologiasService = {
    /**
     * Busca as patologias associadas a um usuário na nossa API.
     *
     * GET /lista-compras/patologias?userId=XYZ
     */
    async getPatologiasDoUsuario(userId: number): Promise<Patologia[]> {
        const { data } = await listaComprasApi.get<Patologia[]>('/patologias', {
            params: { userId },
        });
        return data;
    },

    /**
     * Busca uma patologia específica por ID.
     *
     * GET /lista-compras/patologias/{id}
     * (só vai funcionar se você expor esse endpoint no backend;
     * se não tiver, é só não usar esse método por enquanto.)
     */
    async getPatologiaById(id: number): Promise<Patologia> {
        const { data } = await listaComprasApi.get<Patologia>(`/patologias/${id}`);
        return data;
    },
    async getItensDaPatologia(patologiaId: number): Promise<{ produto: { id: number } }[]> {
        // Retornamos um array de objetos que tenha pelo menos a estrutura do produto
        const { data } = await listaComprasApi.get(`/patologia-itens/patologia/${patologiaId}`);
        return data; // O backend retorna PatologiaItemResponseDTO[]
    },
};


