package br.pucgo.ads.projetointegrador.plataforma.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import br.pucgo.ads.projetointegrador.plataforma.entity.Role;

import java.util.Optional;

public interface RoleRepository extends JpaRepository<Role, Long> {
    
    Optional<Role> findByName(String name);

}