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
    
    @Query("SELECT c FROM Cuidador c WHERE c.ativo = true " +
           "AND (:localizacao IS NULL OR LOWER(c.localizacao) LIKE LOWER(CONCAT('%', :localizacao, '%'))) " +
           "AND (:especialidade IS NULL OR :especialidade MEMBER OF c.especialidades) " +
           "AND (:disponibilidade IS NULL OR c.disponibilidade = :disponibilidade)")
    Page<Cuidador> buscarComFiltros(
            @Param("localizacao") String localizacao,
            @Param("especialidade") String especialidade,
            @Param("disponibilidade") Cuidador.Disponibilidade disponibilidade,
            Pageable pageable
    );
}
