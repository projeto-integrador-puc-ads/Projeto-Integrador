package br.pucgo.ads.projetointegrador.diario_saude.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import br.pucgo.ads.projetointegrador.diario_saude.entity.UsuarioDoencasEntity;

public interface UsuarioDoencaRepository extends JpaRepository<UsuarioDoencasEntity, Long> {

    @Query("""
        SELECT COUNT(u) > 0
        FROM UsuarioDoencasEntity u
        WHERE u.usuario.id_usuario = :usuarioId
        AND u.doenca.id = :doencaId
    """)
    boolean existsByUsuarioAndDoenca(Long usuarioId, Long doencaId);

}
