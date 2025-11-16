import type { Template } from '../../types';

export const mockTemplates: Template[] = [
    {
        id: 101,
        titulo: 'Café da Manhã',
        is_template: true,
        itens: [
            { produto_id: 1, qtd: 1 },
            { produto_id: 2, qtd: 1 },
            { produto_id: 6, qtd: 1 },
            { produto_id: 7, qtd: 2 },
            { produto_id: 9, qtd: 1 },
        ],
    },
    {
        id: 102,
        titulo: 'Feira da Semana',
        is_template: true,
        itens: [
            { produto_id: 4, qtd: 2 },
            { produto_id: 5, qtd: 2 },
            { produto_id: 12, qtd: 1 },
        ],
    },
];
