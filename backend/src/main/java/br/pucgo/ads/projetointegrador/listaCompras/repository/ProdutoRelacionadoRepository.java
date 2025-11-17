package br.pucgo.ads.projetointegrador.listaCompras.repository;

import br.pucgo.ads.projetointegrador.listaCompras.entity.ProdutoRelacionado;
import br.pucgo.ads.projetointegrador.listaCompras.entity.ProdutoRelacionadoId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProdutoRelacionadoRepository extends JpaRepository<ProdutoRelacionado, ProdutoRelacionadoId> {

    // Buscar produtos relacionados a um produto específico, ordenados por afinidade
    @Query("SELECT pr FROM ProdutoRelacionado pr " +
            "WHERE pr.id.produtoId = :produtoId " +
            "ORDER BY pr.afinidade DESC")
    List<ProdutoRelacionado> findProdutosRelacionados(@Param("produtoId") Long produtoId);

    // Buscar top N produtos relacionados
    @Query("SELECT pr FROM ProdutoRelacionado pr " +
            "WHERE pr.id.produtoId = :produtoId " +
            "ORDER BY pr.afinidade DESC " +
            "LIMIT :limit")
    List<ProdutoRelacionado> findTopProdutosRelacionados(@Param("produtoId") Long produtoId,
                                                         @Param("limit") int limit);

    // Verificar se existe relacionamento
    boolean existsById_ProdutoIdAndId_SimilarId(Long produtoId, Long similarId);
}
