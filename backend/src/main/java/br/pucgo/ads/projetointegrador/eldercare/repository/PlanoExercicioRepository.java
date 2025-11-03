package br.pucgo.ads.projetointegrador.eldercare.repository;

import br.pucgo.ads.projetointegrador.eldercare.domain.PlanoExercicio;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PlanoExercicioRepository extends JpaRepository<PlanoExercicio, Long> {

    // Lista planos de um idoso (mais novos primeiro)
    List<PlanoExercicio> findByIdosoIdOrderByDataCriacaoDesc(Long idosoId);
}
