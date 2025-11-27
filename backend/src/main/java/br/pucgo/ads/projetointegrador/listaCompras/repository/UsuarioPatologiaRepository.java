package br.pucgo.ads.projetointegrador.listaCompras.repository;

import br.pucgo.ads.projetointegrador.listaCompras.entity.UsuarioPatologia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UsuarioPatologiaRepository extends JpaRepository<UsuarioPatologia, Long> {

    @Query("""
        select up.patologia.id
        from UsuarioPatologia up
        where up.usuario.id = :usuarioId
    """)
    List<Long> findPatologiaIdsByUsuarioId(@Param("usuarioId") Long usuarioId);
}