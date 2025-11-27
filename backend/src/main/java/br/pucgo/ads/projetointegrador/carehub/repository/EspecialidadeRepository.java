package br.pucgo.ads.projetointegrador.carehub.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import br.pucgo.ads.projetointegrador.carehub.entity.Especialidade;

import java.util.Optional;
import java.util.List;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

@Repository
public interface EspecialidadeRepository extends JpaRepository<Especialidade, Long> {
	Optional<Especialidade> findByNomeIgnoreCase(String nome);

	@Query(value = "SELECT ce.cuidador_id, e.nome FROM ch_cuidador_especialidade ce JOIN ch_especialidade e ON e.id = ce.especialidade_id WHERE ce.cuidador_id IN (:ids)", nativeQuery = true)
	List<Object[]> findNamesByCuidadorIds(@Param("ids") List<Long> ids);
}
