package br.pucgo.ads.projetointegrador.eldercare.repository;

import br.pucgo.ads.projetointegrador.eldercare.domain.Idoso;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface IdosoRepository extends JpaRepository<Idoso, Long> {
    // Em vez de Optional<Idoso> findByEmail(String email)
    List<Idoso> findAllByEmail(String email);

    boolean existsByEmail(String email);
}
