package br.pucgo.ads.projetointegrador.listaCompras.repository;


import br.pucgo.ads.projetointegrador.listaCompras.entity.PatologiaItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PatologiaItemRepository extends JpaRepository<PatologiaItem, Long> {

    // Buscar todos os produtos restritos de uma patologia
    List<PatologiaItem> findByPatologiaId(Long patologiaId);

    // Buscar todas as patologias que restringem um produto
    List<PatologiaItem> findByProdutoId(Long produtoId);

    // Verificar se já existe a relação
    boolean existsByPatologiaIdAndProdutoId(Long patologiaId, Long produtoId);

    // Buscar relação específica
    Optional<PatologiaItem> findByPatologiaIdAndProdutoId(Long patologiaId, Long produtoId);

    // Query IMPORTANTE: Verificar se um produto deve ser alertado para um usuário
    // Retorna true se o usuário tem alguma patologia que restringe o produto
    @Query("SELECT CASE WHEN COUNT(pi) > 0 THEN true ELSE false END " +
            "FROM PatologiaItem pi " +
            "JOIN UsuarioPatologia up ON up.patologia.id = pi.patologia.id " +
            "WHERE up.usuario.id = :usuarioId AND pi.produto.id = :produtoId")
    boolean produtoDeveSerAlertado(@Param("usuarioId") Long usuarioId,
                                   @Param("produtoId") Long produtoId);

    // Query: Buscar quais patologias do usuário restringem o produto (para mostrar detalhes)
    @Query("SELECT pi FROM PatologiaItem pi " +
            "JOIN UsuarioPatologia up ON up.patologia.id = pi.patologia.id " +
            "WHERE up.usuario.id = :usuarioId AND pi.produto.id = :produtoId")
    List<PatologiaItem> findPatologiasQueRestringemProdutoParaUsuario(
            @Param("usuarioId") Long usuarioId,
            @Param("produtoId") Long produtoId);

    // Query: Buscar produtos substituíveis para um produto alertado (para um usuário específico)
    // Retorna PatologiaItem que tem produto_sugestao_id preenchido
    @Query("SELECT pi FROM PatologiaItem pi " +
            "JOIN UsuarioPatologia up ON up.patologia.id = pi.patologia.id " +
            "WHERE up.usuario.id = :usuarioId " +
            "AND pi.produto.id = :produtoId " +
            "AND pi.produtoSugestao IS NOT NULL")
    List<PatologiaItem> findProdutosSubstituiveis(
            @Param("usuarioId") Long usuarioId,
            @Param("produtoId") Long produtoId);

    @Query("""
        SELECT pi
        FROM PatologiaItem pi
        WHERE pi.patologia.id = :patologiaId
          AND pi.produto.id = :produtoId
    """)
    List<PatologiaItem> findProdutosSubstituiveisPorPatologia(
            @Param("patologiaId") Long patologiaId,
            @Param("produtoId") Long produtoId
    );
}
