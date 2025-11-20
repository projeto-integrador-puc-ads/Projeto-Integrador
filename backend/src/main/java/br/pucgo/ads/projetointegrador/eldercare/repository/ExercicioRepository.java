package br.pucgo.ads.projetointegrador.eldercare.repository;

import br.pucgo.ads.projetointegrador.eldercare.domain.ex_exercicio;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface ExercicioRepository extends JpaRepository<ex_exercicio, UUID> {

    // usado pelo QuestionarioService (quando vamos montar o plano)
    Optional<ex_exercicio> findByNome(String nome);

    // usado pelo PlanPersistenceService (semente de dados / migração)
    Optional<ex_exercicio> findByNomeIgnoreCase(String nome);
}
