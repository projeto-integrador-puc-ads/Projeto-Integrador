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
    patologiaId?: number | null;
    template: boolean;
    createdAt: string;
    status?: 'ABERTA' | 'FINALIZADA';
    itens?: ItemListaDTO[];
};

export const listaViewService = {
    async listarDoUsuario(userId: number): Promise<ListaDTO[]> {
        const { data } = await listaComprasApi.get<any[]>( // Tipamos como any[] temporariamente para receber o dado bruto
            `/listas/usuario/${userId}`
        );
        return mapBackendData(data);
    },

    async listarTemplates(userId: number): Promise<ListaDTO[]> {
        const { data } = await listaComprasApi.get<any[]>(
            '/listas/templates',
            {
                params: { userId }
            }
        );
        return mapBackendData(data);
    }
};

function mapBackendData(data: any[]): ListaDTO[] {
    return data.map(lista => ({
        ...lista,
        itens: lista.itens?.map((item: any) => ({
            ...item,
            qtd: item.quantidade ?? item.qtd
        }))
    }));
};
