package br.pucgo.ads.projetointegrador.diario_saude.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import br.pucgo.ads.projetointegrador.diario_saude.entity.UsuarioDoencasEntity;

public interface UsuarioDoencaRepository extends JpaRepository<UsuarioDoencasEntity, Long> {

    boolean existsByUsuario_IdUsuarioAndDoenca_Id(Long usuarioId, Long doencaId);

    List<UsuarioDoencasEntity> findByUsuario_IdUsuario(Long usuarioId);

    void deleteByUsuario_IdUsuarioAndDoenca_Id(Long usuarioId, Long doencaId);

    @Query("""
        SELECT ud FROM UsuarioDoencasEntity ud
        JOIN FETCH ud.doenca d
        WHERE ud.usuario.idUsuario = :idUsuario
    """)
    List<UsuarioDoencasEntity> listarDoencasPorUsuario(Long idUsuario);
}
