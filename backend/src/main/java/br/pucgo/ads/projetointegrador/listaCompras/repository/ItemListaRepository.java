package br.pucgo.ads.projetointegrador.listaCompras.repository;

import br.pucgo.ads.projetointegrador.listaCompras.entity.ItemLista;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ItemListaRepository extends JpaRepository<ItemLista,Long> {

    //Buscar itens por lista
    List<ItemLista> findByCompraListaId(Long compraListaId);

    // Buscar itens comprados de uma lista
    List<ItemLista> findByCompraListaIdAndCompradoTrue(Long compraListaId);

    // Buscar itens não comprados de uma lista
    List<ItemLista> findByCompraListaIdAndCompradoFalse(Long compraListaId);

    // Verificar se já existe o produto na lista
    boolean existsByCompraListaIdAndProdutoId(Long compraListaId, Long produtoId);

    // Query customizada: busca todos os produtos de listas finalizadas de um usuário
    // (Acho que pode ser útil pro algoritmo de recomendação)
    @Query("SELECT i FROM ItemLista i " +
            "JOIN i.compraLista cl " +
            "WHERE cl.usuario.id = :usuarioId " +
            "AND cl.status = 'FINALIZADA'")
    List<ItemLista> findItensByUsuarioFinalizados(@Param("usuarioId") Long usuarioId);
}
