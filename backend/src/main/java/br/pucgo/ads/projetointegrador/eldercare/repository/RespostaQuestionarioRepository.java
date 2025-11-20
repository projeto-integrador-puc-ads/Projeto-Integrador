package br.pucgo.ads.projetointegrador.eldercare.repository;

import br.pucgo.ads.projetointegrador.eldercare.domain.ex_resposta_questionario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface RespostaQuestionarioRepository extends JpaRepository<ex_resposta_questionario, UUID> {}
