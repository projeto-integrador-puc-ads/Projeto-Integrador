package br.pucgo.ads.projetointegrador.listaCompras.repository;


import br.pucgo.ads.projetointegrador.listaCompras.entity.Lista;
import br.pucgo.ads.projetointegrador.listaCompras.entity.Lista.StatusLista;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CompraListaRepository extends JpaRepository<Lista,Long> {

    // Buscar listas por usuário
    List<Lista> findByUsuario_Id(Long usuarioId);

    // Buscar listas por usuário e status
    List<Lista> findByUsuario_IdAndStatus(Long usuarioId, StatusLista status);

    // Buscar listas do usuário por status, ordenadas pela criação (campo REAL da entidade)
    List<Lista> findByUsuario_IdAndStatusOrderByCreatedAtDesc(Long usuarioId, StatusLista status);
}

