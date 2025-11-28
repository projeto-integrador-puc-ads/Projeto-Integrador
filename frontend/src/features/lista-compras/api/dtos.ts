
export interface CategoriaResponseDTO {
    id: number;
    nome: string;
}

export interface ProdutoResponseDTO {
    id: number;
    nome: string;
    nomeNormalizado?: string | null;
    preco?: string | number | null;
    ativo?: boolean | null;
    isPersonalizado?: boolean | null;
    tags?: string | null;
    categoria?: CategoriaResponseDTO | null;
    createdAt?: string | null;
    updatedAt?: string | null;

    descricao?: string | null;
    unidadeMedida?: string | null;
}

export type ListaDeComprasDTO = {
    titulo: string;
    itens: {
        produtoId: number;   // 👈 camelCase, igual ao DTO do back
        qtd: number;
    }[];
    isTemplate?: boolean;
    patologiaId?: number;
};

export type ListaDeComprasSalva = ListaDeComprasDTO & {
    id: number;
};
