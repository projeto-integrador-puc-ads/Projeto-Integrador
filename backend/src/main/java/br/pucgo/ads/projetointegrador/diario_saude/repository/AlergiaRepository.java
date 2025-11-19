package br.pucgo.ads.projetointegrador.diario_saude.repository;

import br.pucgo.ads.projetointegrador.diario_saude.entity.AlergiaEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AlergiaRepository extends JpaRepository<AlergiaEntity, Long> {
    Optional<AlergiaEntity> findByCodigo(String codigo);
}
