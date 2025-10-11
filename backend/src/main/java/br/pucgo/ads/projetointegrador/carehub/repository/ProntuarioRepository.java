package br.pucgo.ads.projetointegrador.carehub.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import br.pucgo.ads.projetointegrador.carehub.entity.Prontuario;

import java.util.Optional;

@Repository
public interface ProntuarioRepository extends JpaRepository<Prontuario, Long> {
    Optional<Prontuario> findByClienteId(Long clienteId);
}
