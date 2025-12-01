package br.pucgo.ads.projetointegrador.carehub.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import br.pucgo.ads.projetointegrador.carehub.entity.Cuidador;

import java.util.List;

@Repository
public interface CuidadorRepository extends JpaRepository<Cuidador, Long> {
    
    // Platform model uses deletedAt to indicate soft-delete; active users have deletedAt = null
    List<Cuidador> findByDeletedAtIsNull();

    boolean existsByUsername(String username);
    
    java.util.Optional<Cuidador> findByUsername(String username);
    
                @Query(value = "SELECT c FROM Cuidador c " +
                    "WHERE c.deletedAt IS NULL " +
                    "AND (:localizacao IS NULL OR c.cidade LIKE CONCAT('%',:localizacao,'%') OR c.estado = :localizacao) " +
                    "AND (:especialidade IS NULL OR EXISTS (SELECT 1 FROM c.especialidades se WHERE se.nome LIKE CONCAT('%',:especialidade,'%'))) " +
                    "AND (:disponibilidade IS NULL OR c.disponibilidade = :disponibilidade)")
            Page<Cuidador> buscarComFiltros(
                @Param("localizacao") String localizacao,
                @Param("especialidade") String especialidade,
                @Param("disponibilidade") Boolean disponibilidade,
                Pageable pageable
            );

                // Fallback native query that attempts to cast bytea columns to text when DB stores them as binary.
                @Query(value = "SELECT u.*, c.* FROM users u JOIN ch_cuidador c ON u.id = c.id " +
                    "LEFT JOIN ch_cuidador_especialidade ce ON c.id = ce.cuidador_id " +
                    "LEFT JOIN ch_especialidade es ON ce.especialidade_id = es.id " +
                    "WHERE u.deleted_at IS NULL " +
                    "AND (:localizacao IS NULL OR (convert_from(c.estado, 'UTF8') = :localizacao) OR (convert_from(c.cidade, 'UTF8') ILIKE '%'||:localizacao||'%')) " +
                    "AND (:especialidade IS NULL OR lower(es.nome) LIKE lower('%'||:especialidade||'%')) " +
                    "AND (:disponibilidade IS NULL OR c.disponibilidade = :disponibilidade) ",
                    countQuery = "SELECT count(DISTINCT c.id) FROM ch_cuidador c JOIN users u ON u.id = c.id " +
                        "LEFT JOIN ch_cuidador_especialidade ce ON c.id = ce.cuidador_id " +
                        "LEFT JOIN ch_especialidade es ON ce.especialidade_id = es.id " +
                        "WHERE u.deleted_at IS NULL " +
                        "AND (:localizacao IS NULL OR (convert_from(c.estado, 'UTF8') = :localizacao) OR (convert_from(c.cidade, 'UTF8') ILIKE '%'||:localizacao||'%')) " +
                        "AND (:especialidade IS NULL OR lower(es.nome) LIKE lower('%'||:especialidade||'%')) " +
                        "AND (:disponibilidade IS NULL OR c.disponibilidade = :disponibilidade)",
                    nativeQuery = true)
                Page<Cuidador> buscarComFiltrosNative(@Param("localizacao") String localizacao,
                                  @Param("especialidade") String especialidade,
                                  @Param("disponibilidade") Boolean disponibilidade,
                                  Pageable pageable);

                // Native variant that avoids any convert_from/casting and uses ILIKE directly.
                @Query(value = "SELECT u.*, c.* FROM users u JOIN ch_cuidador c ON u.id = c.id " +
                    "LEFT JOIN ch_cuidador_especialidade ce ON c.id = ce.cuidador_id " +
                    "LEFT JOIN ch_especialidade es ON ce.especialidade_id = es.id " +
                    "WHERE u.deleted_at IS NULL " +
                    "AND (:localizacao IS NULL OR (c.estado = :localizacao) OR (c.cidade ILIKE '%'||:localizacao||'%')) " +
                    "AND (:especialidade IS NULL OR es.nome ILIKE '%'||:especialidade||'%') " +
                    "AND (:disponibilidade IS NULL OR c.disponibilidade = :disponibilidade)",
                    countQuery = "SELECT count(DISTINCT c.id) FROM ch_cuidador c JOIN users u ON u.id = c.id " +
                        "LEFT JOIN ch_cuidador_especialidade ce ON c.id = ce.cuidador_id " +
                        "LEFT JOIN ch_especialidade es ON ce.especialidade_id = es.id " +
                        "WHERE u.deleted_at IS NULL " +
                        "AND (:localizacao IS NULL OR (c.estado = :localizacao) OR (c.cidade ILIKE '%'||:localizacao||'%')) " +
                        "AND (:especialidade IS NULL OR es.nome ILIKE '%'||:especialidade||'%') " +
                        "AND (:disponibilidade IS NULL OR c.disponibilidade = :disponibilidade)",
                    nativeQuery = true)
                Page<Cuidador> buscarComFiltrosNativeSimple(@Param("localizacao") String localizacao,
                                  @Param("especialidade") String especialidade,
                                  @Param("disponibilidade") Boolean disponibilidade,
                                  Pageable pageable);

                // Projection-based native queries (return only selected columns mapped to CuidadorProjection)
                @Query(value = "SELECT u.id as \"id\", u.name as \"name\", u.email as \"email\", u.phone as \"phone\", u.experiencia as \"experiencia\", c.cidade as \"cidade\", c.estado as \"estado\", c.disponibilidade as \"disponibilidade\", c.taxa_hora as \"taxaHora\", c.avaliacao_media as \"avaliacaoMedia\", c.total_avaliacoes as \"totalAvaliacoes\", c.biografia as \"biografia\", c.foto_perfil as \"fotoPerfil\", u.created_at as \"createdAt\", (u.deleted_at IS NULL) as \"ativo\" " +
                    "FROM users u JOIN ch_cuidador c ON u.id = c.id " +
                    "LEFT JOIN ch_cuidador_especialidade ce ON c.id = ce.cuidador_id " +
                    "LEFT JOIN ch_especialidade es ON ce.especialidade_id = es.id " +
                    "WHERE u.deleted_at IS NULL " +
                    "AND (:localizacao IS NULL OR (convert_from(c.estado, 'UTF8') = :localizacao) OR (convert_from(c.cidade, 'UTF8') ILIKE '%'||:localizacao||'%')) " +
                    "AND (:especialidade IS NULL OR lower(es.nome) LIKE lower('%'||:especialidade||'%')) " +
                    "AND (:disponibilidade IS NULL OR c.disponibilidade = :disponibilidade)",
                    countQuery = "SELECT count(DISTINCT c.id) FROM ch_cuidador c JOIN users u ON u.id = c.id " +
                        "LEFT JOIN ch_cuidador_especialidade ce ON c.id = ce.cuidador_id " +
                        "LEFT JOIN ch_especialidade es ON ce.especialidade_id = es.id " +
                        "WHERE u.deleted_at IS NULL " +
                        "AND (:localizacao IS NULL OR (convert_from(c.estado, 'UTF8') = :localizacao) OR (convert_from(c.cidade, 'UTF8') ILIKE '%'||:localizacao||'%')) " +
                        "AND (:especialidade IS NULL OR lower(es.nome) LIKE lower('%'||:especialidade||'%')) " +
                        "AND (:disponibilidade IS NULL OR c.disponibilidade = :disponibilidade)",
                    nativeQuery = true)
                Page<CuidadorProjection> buscarProjectionNative(@Param("localizacao") String localizacao,
                                  @Param("especialidade") String especialidade,
                                  @Param("disponibilidade") Boolean disponibilidade,
                                  Pageable pageable);

                @Query(value = "SELECT u.id as \"id\", u.name as \"name\", u.email as \"email\", u.phone as \"phone\", u.experiencia as \"experiencia\", c.cidade as \"cidade\", c.estado as \"estado\", c.disponibilidade as \"disponibilidade\", c.taxa_hora as \"taxaHora\", c.avaliacao_media as \"avaliacaoMedia\", c.total_avaliacoes as \"totalAvaliacoes\", c.biografia as \"biografia\", c.foto_perfil as \"fotoPerfil\", u.created_at as \"createdAt\", (u.deleted_at IS NULL) as \"ativo\" " +
                    "FROM users u JOIN ch_cuidador c ON u.id = c.id " +
                    "LEFT JOIN ch_cuidador_especialidade ce ON c.id = ce.cuidador_id " +
                    "LEFT JOIN ch_especialidade es ON ce.especialidade_id = es.id " +
                    "WHERE u.deleted_at IS NULL " +
                    "AND (:localizacao IS NULL OR (c.estado = :localizacao) OR (c.cidade ILIKE '%'||:localizacao||'%')) " +
                    "AND (:especialidade IS NULL OR es.nome ILIKE '%'||:especialidade||'%') " +
                    "AND (:disponibilidade IS NULL OR c.disponibilidade = :disponibilidade)",
                    countQuery = "SELECT count(DISTINCT c.id) FROM ch_cuidador c JOIN users u ON u.id = c.id " +
                        "LEFT JOIN ch_cuidador_especialidade ce ON c.id = ce.cuidador_id " +
                        "LEFT JOIN ch_especialidade es ON ce.especialidade_id = es.id " +
                        "WHERE u.deleted_at IS NULL " +
                        "AND (:localizacao IS NULL OR (c.estado = :localizacao) OR (c.cidade ILIKE '%'||:localizacao||'%')) " +
                        "AND (:especialidade IS NULL OR es.nome ILIKE '%'||:especialidade||'%') " +
                        "AND (:disponibilidade IS NULL OR c.disponibilidade = :disponibilidade)",
                    nativeQuery = true)
                Page<CuidadorProjection> buscarProjectionNativeSimple(@Param("localizacao") String localizacao,
                                  @Param("especialidade") String especialidade,
                                  @Param("disponibilidade") Boolean disponibilidade,
                                  Pageable pageable);
}
