package br.pucgo.ads.projetointegrador.plataforma.repository;

import br.pucgo.ads.projetointegrador.plataforma.entity.Module;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ModuleRepository extends JpaRepository<Module, Long> {
    Optional<Module> findByCode(String code);
    Boolean existsByCode(String code);
}
