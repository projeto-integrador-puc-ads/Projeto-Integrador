package br.pucgo.ads.projetointegrador.eldercare.repository;

import br.pucgo.ads.projetointegrador.eldercare.domain.ex_dia_plano;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface DiaPlanoRepository extends JpaRepository<ex_dia_plano, UUID> {

    // Busca todos os dias de um plano, em ordem
    List<ex_dia_plano> findByPlano_IdOrderByDataOuOrdemAsc(UUID planoId);
}
