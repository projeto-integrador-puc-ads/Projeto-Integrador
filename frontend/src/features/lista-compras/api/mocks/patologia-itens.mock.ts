import type { PatologiaItem } from '../../types';

export const mockPatologiaItens: PatologiaItem[] = [
    // Lactose
    { patologia_id: 100, produto_id: 1, nivel: 'alta' },
    { patologia_id: 100, produto_id: 7, nivel: 'media' },
    { patologia_id: 100, produto_id: 8, nivel: 'media' },
    { patologia_id: 100, produto_id: 9, nivel: 'baixa' },

    // Glúten
    { patologia_id: 200, produto_id: 6, nivel: 'alta' },
    { patologia_id: 200, produto_id: 12, nivel: 'media' },

    // Hipertensão
    { patologia_id: 300, produto_id: 13, nivel: 'media' },
    { patologia_id: 300, produto_id: 14, nivel: 'media' },
    { patologia_id: 300, produto_id: 15, nivel: 'alta' },
    { patologia_id: 300, produto_id: 10, nivel: 'baixa' },

    // Diabetes
    { patologia_id: 400, produto_id: 11, nivel: 'alta' },
    { patologia_id: 400, produto_id: 9,  nivel: 'media' },
    { patologia_id: 400, produto_id: 10, nivel: 'media' },
];
