package br.pucgo.ads.projetointegrador.listaCompras.repository;


import br.pucgo.ads.projetointegrador.listaCompras.entity.CompraLista;
import br.pucgo.ads.projetointegrador.listaCompras.entity.CompraLista.StatusLista;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CompraListaRepository extends JpaRepository<CompraLista,Long> {

    // Buscar listas por usuário
    List<CompraLista> findByUsuarioId(Long usuarioId);

    // Buscar listas por usuário e status
    List<CompraLista> findByUsuarioIdAndStatus(Long usuarioId, StatusLista status);

    // Buscar listas finalizadas do usuário (para o algoritmo de recomendação)
    List<CompraLista> findByUsuarioIdAndStatusOrderByDataFinalizacaoDesc(Long usuarioId, StatusLista status);

    // Buscar listas abertas do usuário
    List<CompraLista> findByUsuarioIdAndStatusOrderByDataCriacaoDesc(Long usuarioId, StatusLista status);
}
