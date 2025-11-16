import type { Patologia } from '../../types';

const patologiasMock: Patologia[] = [
    { id: 100, nome: 'Intolerância à Lactose' },
    { id: 300, nome: 'Hipertensão' },
];

export const mockFetchUserPatologias = async (): Promise<Patologia[]> => {
    await new Promise((r) => setTimeout(r, 300));
    return patologiasMock;
};
