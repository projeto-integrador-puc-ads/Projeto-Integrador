package br.pucgo.ads.projetointegrador.listaCompras.repository;

import br.pucgo.ads.projetointegrador.listaCompras.entity.ItemLista;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ItemListaRepository extends JpaRepository<ItemLista,Long> {

    // Buscar itens por lista
    List<ItemLista> findById_ListaId(Long listaId);

    // Buscar item específico por listaId e produtoId
    Optional<ItemLista> findById_ListaIdAndId_ProdutoId(Long listaId, Long produtoId);

    // Verificar se já existe o produto na lista (evitar duplicatas)
    boolean existsById_ListaIdAndId_ProdutoId(Long listaId, Long produtoId);

    // Deletar item específico
    void deleteById_ListaIdAndId_ProdutoId(Long listaId, Long produtoId);

    // Query: buscar todos os produtos de listas finalizadas de um usuário
    // (útil para o algoritmo de recomendação)
    @Query("SELECT i FROM ItemLista i " +
            "JOIN i.lista l " +
            "WHERE l.usuario.id = :usuarioId " +
            "AND l.status = 'FINALIZADA'")
    List<ItemLista> findItensByUsuarioFinalizados(@Param("usuarioId") Long usuarioId);

    // Query: contar quantos itens tem uma lista
    @Query("SELECT COUNT(i) FROM ItemLista i WHERE i.id.listaId = :listaId")
    long countByListaId(@Param("listaId") Long listaId);
}
