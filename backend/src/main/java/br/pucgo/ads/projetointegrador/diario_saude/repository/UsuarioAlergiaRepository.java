package br.pucgo.ads.projetointegrador.diario_saude.repository;

import br.pucgo.ads.projetointegrador.diario_saude.entity.UsuarioAlergiaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface UsuarioAlergiaRepository extends JpaRepository<UsuarioAlergiaEntity, Long> {

    boolean existsByUsuario_IdUsuarioAndAlergia_Id(Long usuarioId, Long alergiaId);

    List<UsuarioAlergiaEntity> findByUsuario_IdUsuario(Long usuarioId);

    Optional<UsuarioAlergiaEntity> findByUsuario_IdUsuarioAndAlergia_Id(Long usuarioId, Long alergiaId);

    @Query("""
        SELECT ua FROM UsuarioAlergiaEntity ua
        JOIN FETCH ua.alergia a
        WHERE ua.usuario.idUsuario = :idUsuario
    """)
    List<UsuarioAlergiaEntity> listarAlergiasPorUsuario(Long idUsuario);
}
