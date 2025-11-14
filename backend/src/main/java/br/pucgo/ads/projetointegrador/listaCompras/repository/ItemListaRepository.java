package br.pucgo.ads.projetointegrador.listaCompras.repository;

import br.pucgo.ads.projetointegrador.listaCompras.entity.ItemLista;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ItemListaRepository extends JpaRepository<ItemLista,Long> {

    // Buscar itens por lista (campo "lista")
    List<ItemLista> findByLista_Id(Long listaId);

    // Verificar se já existe o produto na lista
    boolean existsByLista_IdAndProduto_Id(Long listaId, Long produtoId);

    // Itens de listas FINALIZADAS de um usuário (pro algoritmo de recomendação)
    @Query("""
           SELECT i
           FROM ItemLista i
           JOIN i.lista l
           WHERE l.usuario.id = :usuarioId
             AND l.status = 'FINALIZADA'
           """)
    List<ItemLista> findItensByUsuarioFinalizados(@Param("usuarioId") Long usuarioId);
}
