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
import {listaComprasApi} from "@/features/lista-compras/api/http.ts";
import type {ListaDeComprasDTO, ListaDeComprasSalva} from "@/features/lista-compras/api/dtos.ts";

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));


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

    async criarLista(payload: ListaDeComprasDTO, userId: number): Promise<ListaDeComprasSalva> {
        // chama: POST /api/lista-compras/listas?userId=XYZ
        const { data } = await listaComprasApi.post<ListaDeComprasSalva>(
            '/listas',
            payload,
            { params: { userId } }
        );

        return data;
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
