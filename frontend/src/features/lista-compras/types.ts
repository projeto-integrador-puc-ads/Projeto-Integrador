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
    produtoSugestao: ProdutoSugestaoDTO;
}
