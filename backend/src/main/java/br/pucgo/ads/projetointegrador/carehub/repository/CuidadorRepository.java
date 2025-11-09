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
    
    List<Cuidador> findByAtivoTrue();
    
    @Query(value = "SELECT u.id, u.name, u.email, u.password, u.username, u.telefone, u.ativo, u.created_at, u.updated_at, " +
           "c.experiencia, c.disponibilidade, c.taxa_hora, c.biografia, c.foto_perfil, " +
           "c.cidade, c.estado, c.avaliacao_media, c.total_avaliacoes " +
           "FROM ch_cuidador c " +
           "JOIN users u ON c.id = u.id " +
           "WHERE u.ativo = true " +
           "AND (:localizacao IS NULL OR " +
           "LOWER(c.cidade::text) LIKE LOWER(CONCAT('%', :localizacao, '%')) OR " +
           "LOWER(c.estado::text) = LOWER(:localizacao)) " +
           "AND (:disponibilidade IS NULL OR c.disponibilidade = :disponibilidade) " +
           "ORDER BY c.avaliacao_media DESC NULLS LAST",
           countQuery = "SELECT COUNT(*) FROM ch_cuidador c " +
           "JOIN users u ON c.id = u.id " +
           "WHERE u.ativo = true " +
           "AND (:localizacao IS NULL OR " +
           "LOWER(c.cidade::text) LIKE LOWER(CONCAT('%', :localizacao, '%')) OR " +
           "LOWER(c.estado::text) = LOWER(:localizacao)) " +
           "AND (:disponibilidade IS NULL OR c.disponibilidade = :disponibilidade)",
           nativeQuery = true)
    Page<Cuidador> buscarComFiltros(
            @Param("localizacao") String localizacao,
            @Param("disponibilidade") Boolean disponibilidade,
            Pageable pageable
    );
}
