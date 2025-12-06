package br.pucgo.ads.projetointegrador.carehub.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import br.pucgo.ads.projetointegrador.carehub.entity.Cliente;

import java.util.List;
import java.util.Optional;

@Repository
public interface ClienteRepository extends JpaRepository<Cliente, Long> {
    // Platform model uses deletedAt to indicate soft-delete; active users have deletedAt = null
    List<Cliente> findByDeletedAtIsNull();

    boolean existsByUsername(String username);
    
    Optional<Cliente> findByUsername(String username);
}
