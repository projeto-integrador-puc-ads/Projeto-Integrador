package br.pucgo.ads.projetointegrador.diario_saude.repository;

import br.pucgo.ads.projetointegrador.diario_saude.entity.DoencasEntity;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface DoencaRepository extends JpaRepository<DoencasEntity, Long> {
    Optional<DoencasEntity> findByCodigo(String codigo);
}
