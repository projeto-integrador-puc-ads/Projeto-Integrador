package br.pucgo.ads.projetointegrador.diario_saude.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import br.pucgo.ads.projetointegrador.diario_saude.entity.ExercicioEntity;

public interface ExercicioRepository extends JpaRepository<ExercicioEntity, Long> {
}
