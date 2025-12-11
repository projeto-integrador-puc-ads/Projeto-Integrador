package br.pucgo.ads.projetointegrador.carekeeper.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import br.pucgo.ads.projetointegrador.carekeeper.entity.ConfigurationEntity;

import java.util.Optional;

@Repository
public interface ConfigurationRepository extends JpaRepository<ConfigurationEntity, Long> {
    Optional<ConfigurationEntity> findByUserId(Long userId);
    boolean existsByUserId(Long userId);
}
