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
