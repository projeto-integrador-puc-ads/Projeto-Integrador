package br.pucgo.ads.projetointegrador.plataforma.repository;

import br.pucgo.ads.projetointegrador.plataforma.entity.Permission;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PermissionRepository extends JpaRepository<Permission, Long> {
    Optional<Permission> findByName(String name);
    List<Permission> findByModuleId(Long moduleId);
    Boolean existsByName(String name);
}

