// src/features/lista-compras/api/listaComprasService.ts
import type {
    Produto,
    Template,
    Patologia,
    PatologiaItem,
} from '../types';
// Quando for usar API real, é só descomentar:
// import { listaComprasApi } from './http';

import { mockProdutos } from './mocks/produtos.mock';
import { mockTemplates } from './mocks/templates.mock';
import { mockPatologiaItens } from './mocks/patologia-itens.mock';
import { mockFetchUserPatologias } from './mocks/patologias.mock';
import { mockRelacionados, mockPopulares } from './mocks/relacionados.mock';

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

/** Payload que o front envia para criar/atualizar uma lista de compras */
export type ListaDeComprasDTO = {
    titulo: string;
    itens: {
        produto_id: number;
        qtd: number;
    }[];
};

export type ListaDeComprasSalva = ListaDeComprasDTO & {
    id: number;
};

let listasStore: ListaDeComprasSalva[] = [];

export const listaComprasService = {
    // ===== PRODUTOS ======================================================

    /** Busca catálogo completo de produtos (simulado) */
    async getProdutos(): Promise<Produto[]> {
        await delay(200);

        // Quando tiver API real:
        // const { data } = await listaComprasApi.get<Produto[]>('/produtos');
        // return data;

        return mockProdutos;
    },

    /**
     * Autocomplete: busca produtos pelo nome.
     * - só busca se termo >= 3 caracteres
     * - retorna no máximo `limit` resultados
     */
    async searchProdutosByNome(
        termo: string,
        limit = 5
    ): Promise<Produto[]> {
        const termoNorm = termo.trim().toLowerCase();
        if (termoNorm.length < 3) {
            return [];
        }

        await delay(250);

        const filtrados = mockProdutos.filter((p) =>
            p.nome_normalizado.includes(termoNorm)
        );

        return filtrados.slice(0, limit);

        // Versão real (exemplo):
        // const { data } = await listaComprasApi.get<Produto[]>('/produtos', {
        //   params: { q: termo, limit },
        // });
        // return data;
    },

    // ===== TEMPLATES =====================================================

    /** Modelos rápidos de lista (templates) */
    async getTemplates(): Promise<Template[]> {
        await delay(200);
        return mockTemplates;
    },

    // ===== PATOLOGIAS ====================================================

    /** Patologias do usuário logado (mock da integração externa) */
    async getPatologiasDoUsuario(): Promise<Patologia[]> {
        // já é uma função async mockada
        return mockFetchUserPatologias();
    },

    /** Mapeamento produto_id -> patologias que disparam alerta */
    async getPatologiaItens(): Promise<PatologiaItem[]> {
        await delay(150);
        return mockPatologiaItens;
    },

    // ===== RELACIONADOS / POPULARES =====================================

    /**
     * Retorna produtos relacionados ao produto base ou,
     * caso não haja relacionados, uma lista de populares.
     */
    async getRelacionadosOuPopulares(
        baseProdutoId: number
    ): Promise<Produto[]> {
        await delay(200);

        const candidatosIds =
            mockRelacionados[baseProdutoId] &&
            mockRelacionados[baseProdutoId].length
                ? mockRelacionados[baseProdutoId]
                : mockPopulares;

        const produtos = candidatosIds
            .map((id) => mockProdutos.find((p) => p.id === id))
            .filter(
                (p): p is Produto =>
                    !!p && p.id !== baseProdutoId
            );

        return produtos;
    },

    // ===== LISTAS DE COMPRAS (CRUD SIMULADO) ============================

    /** Cria uma nova lista de compras no "banco" em memória */
    async criarLista(
        payload: ListaDeComprasDTO
    ): Promise<ListaDeComprasSalva> {
        await delay(400);

        const novoId = listasStore.length
            ? Math.max(...listasStore.map((l) => l.id)) + 1
            : 1;

        const novaLista: ListaDeComprasSalva = {
            id: novoId,
            ...payload,
        };

        listasStore.push(novaLista);

        console.log('[listaComprasService] lista criada:', novaLista);

        // Versão real:
        // const { data } = await listaComprasApi.post<ListaDeComprasSalva>(
        //   '/listas',
        //   payload
        // );
        // return data;

        return novaLista;
    },

    /** Lista todas as listas salvas (no mock em memória) */
    async listarListas(): Promise<ListaDeComprasSalva[]> {
        await delay(200);
        return listasStore;

        // API real:
        // const { data } = await listaComprasApi.get<ListaDeComprasSalva[]>('/listas');
        // return data;
    },

    /** Busca uma lista específica pelo id */
    async obterListaPorId(
        id: number
    ): Promise<ListaDeComprasSalva | null> {
        await delay(200);
        const lista = listasStore.find((l) => l.id === id);
        return lista ?? null;

        // API real:
        // const { data } = await listaComprasApi.get<ListaDeComprasSalva>(`/listas/${id}`);
        // return data;
    },
};
