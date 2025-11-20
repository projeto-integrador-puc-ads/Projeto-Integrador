package br.pucgo.ads.projetointegrador.eldercare.repository;

import br.pucgo.ads.projetointegrador.eldercare.domain.ex_item_plano;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ItemPlanoRepository extends JpaRepository<ex_item_plano, UUID> {

    // Busca os itens de um dia do plano, ordenados
    List<ex_item_plano> findByDia_IdOrderByOrdemAsc(UUID diaId);
}
