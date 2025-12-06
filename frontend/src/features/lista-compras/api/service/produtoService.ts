import { listaComprasApi } from '../http';
import type { ProdutoSubstituivel, Produto } from '../../types';

const baseUrl: String = '/produtos'

const mapProdutoSubstituivel = (dto: any): ProdutoSubstituivel => ({
    produtoAlertadoId: dto.produtoAlertadoId,
    produtoAlertadoNome: dto.produtoAlertadoNome,
    patologia: {
        id: dto.patologia.id,
        nome: dto.patologia.nome,
        descricao: dto.patologia.descricao,
    },
    produtoSugestao: dto.produtoSugestao
        ? {
            id: dto.produtoSugestao.id,
            nome: dto.produtoSugestao.nome,
            nomeNormalizado: dto.produtoSugestao.nomeNormalizado,
            preco: dto.produtoSugestao.preco,
            ativo: dto.produtoSugestao.ativo,
            isPersonalizado: dto.produtoSugestao.isPersonalizado,
            tags: dto.produtoSugestao.tags,
        }
        : null,
});

export const produtoService = {
    async listarSubstituiveis(
        produtoId: number,
        userId: number
    ): Promise<ProdutoSubstituivel[]> {
        const { data } = await listaComprasApi.get(
            `${baseUrl}/${produtoId}/substituiveis`,
            { params: { userId } }
        );

        return data.map(mapProdutoSubstituivel);
    },

    async listarSubstituiveisPorPatologia(
        produtoId: number,
        patologiaId: number
    ): Promise<ProdutoSubstituivel[]> {
        const { data } = await listaComprasApi.get(
            `${baseUrl}/${produtoId}/substituiveis-por-patologia`,
            { params: { patologiaId } }
        );

        return (data as any[]).map(mapProdutoSubstituivel);
    },
};