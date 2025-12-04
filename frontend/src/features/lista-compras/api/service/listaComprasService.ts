// src/features/lista-compras/api/listaComprasService.ts
import type {
    Produto,
    Template,
    Patologia,
    PatologiaItem,
} from '../../types.ts';
// Quando for usar API real, é só descomentar:
// import { listaComprasApi } from './http';

import { mockProdutos } from '../mocks/produtos.mock.ts';
import { mockTemplates } from '../mocks/templates.mock.ts';
import { mockPatologiaItens } from '../mocks/patologia-itens.mock.ts';
import { mockFetchUserPatologias } from '../mocks/patologias.mock.ts';
import { mockRelacionados, mockPopulares } from '../mocks/relacionados.mock.ts';
import {listaComprasApi} from "@/features/lista-compras/api/http.ts";
import type {ListaDeComprasDTO, ListaDeComprasSalva} from "@/features/lista-compras/api/dtos.ts";

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));


let listasStore: ListaDeComprasSalva[] = [];

export const listaComprasService = {



    /**
     * Autocomplete: busca produtos pelo nome.
     * - só busca se termo >= 3 caracteres
     * - retorna no máximo `limit` resultados
     */
    async searchProdutosByNome(termo: string): Promise<Produto[]> {
        const clean = termo.trim();
        if (clean.length < 3) return [];

        const { data } = await listaComprasApi.get(
            `/produtos/buscar?param=${encodeURIComponent(clean)}`
        );

        return data.map((dto: any) => ({
            id: dto.id,
            nome: dto.nome,
            nome_normalizado:
                dto.nomeNormalizado?.toLowerCase().trim()
                ?? dto.nome.toLowerCase().trim(),
            ativo: dto.ativo ?? true,
            is_personalizado: dto.isPersonalizado ?? false,
        }));
    },


    // ===== LISTAS DE COMPRAS (CRUD SIMULADO) ============================

    async criarLista(payload: ListaDeComprasDTO, userId: number): Promise<ListaDeComprasSalva> {
        // chama: POST /api/lista-compras/listas?userId=XYZ
        const { data } = await listaComprasApi.post<ListaDeComprasSalva>(
            '/listas',
            payload,
            { params: { userId } }
        );

        return data;
    },

    async atualizarLista(
        listaId: number,
        payload: ListaDeComprasDTO
    ): Promise<ListaDeComprasSalva> {
        // PUT /lista-compras/listas/{id}
        const { data } = await listaComprasApi.put<ListaDeComprasSalva>(
            `/listas/${listaId}`,
            payload
        );

        return data;
    },


};
