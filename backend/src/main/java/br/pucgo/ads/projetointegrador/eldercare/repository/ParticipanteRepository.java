package br.pucgo.ads.projetointegrador.eldercare.repository;

import br.pucgo.ads.projetointegrador.eldercare.domain.ex_participante;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface ParticipanteRepository extends JpaRepository<ex_participante, UUID> {
}
