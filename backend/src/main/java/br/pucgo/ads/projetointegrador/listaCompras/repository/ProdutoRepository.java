package br.pucgo.ads.projetointegrador.listaCompras.repository;


import br.pucgo.ads.projetointegrador.listaCompras.entity.Produto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProdutoRepository extends JpaRepository<Produto, Long> {
    // Buscar produtos por categoria
    List<Produto> findByCategoria_Id(Long categoriaId);

    // Buscar produto por nome
    Optional<Produto> findByNomeIgnoreCase(String nome);

    // Buscar produtos por nome contendo (busca)
    List<Produto> findByNomeContainingIgnoreCase(String nome);
}
