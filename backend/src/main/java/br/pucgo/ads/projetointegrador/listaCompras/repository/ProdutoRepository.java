package br.pucgo.ads.projetointegrador.listaCompras.repository;


import br.pucgo.ads.projetointegrador.listaCompras.entity.Produto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProdutoRepository extends JpaRepository<Produto, Long> {
    // Buscar produtos ativos
    List<Produto> findByAtivoTrue();

    // Buscar produtos por categoria
    List<Produto> findByCategoriaIdAndAtivoTrue(Long categoriaId);

    // Buscar produto por nome
    Optional<Produto> findByNomeIgnoreCase(String nome);

    // Buscar produtos por nome contendo (busca)
    List<Produto> findByNomeContainingIgnoreCaseAndAtivoTrue(String nome);

    // Buscar por nome normalizado (sem acentos)
    List<Produto> findByNomeNormalizadoContainingAndAtivoTrue(String nomeNormalizado);

    // Buscar por nome normalizado (case-insensitive por padrão)
    @Query(value = "SELECT * FROM produto WHERE f_unaccent(nome_normalizado) LIKE f_unaccent(CONCAT('%', LOWER(:termo), '%')) AND ativo = true",
            nativeQuery = true)
    List<Produto> findByNomeNormalizado(@Param("termo") String termo);

    // Buscar produtos por tags
    List<Produto> findByTagsContainingIgnoreCaseAndAtivoTrue(String tag);

    List<Produto> findTop5ByNomeContainingIgnoreCaseAndAtivoTrue(String nome);


    // Buscar produtos personalizados do sistema ou ativos
    List<Produto> findByIsPersonalizadoFalseAndAtivoTrue();
}
