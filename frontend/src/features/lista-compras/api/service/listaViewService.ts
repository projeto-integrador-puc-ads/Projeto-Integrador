import { listaComprasApi } from './../http.ts';
import type { Produto } from '../../types.ts';

export type ItemListaDTO = {
    produtoId: number;
    qtd: number;
    produto?: Produto;
};

export type ListaDTO = {
    id: number;
    titulo: string;
    userId: number;
    userName?: string;
    template: boolean;
    createdAt: string;
    status?: 'ABERTA' | 'FINALIZADA';
    itens?: ItemListaDTO[];
};

export const listaViewService = {
    async listarDoUsuario(userId: number): Promise<ListaDTO[]> {
        const { data } = await listaComprasApi.get<ListaDTO[]>(
            `/listas/usuario/${userId}`
        );
        return data;
    },

    async listarTemplates(userId: number): Promise<ListaDTO[]> {
        const { data } = await listaComprasApi.get<ListaDTO[]>(
            '/listas/templates',
            {
                params: { userId }
            }
        );
        return data;
    }
};
