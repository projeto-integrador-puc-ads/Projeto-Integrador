package br.pucgo.ads.projetointegrador.carehub.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import br.pucgo.ads.projetointegrador.carehub.entity.Avaliacao;
import br.pucgo.ads.projetointegrador.carehub.entity.Cuidador;

import java.util.List;

@Repository
public interface AvaliacaoRepository extends JpaRepository<Avaliacao, Long> {
    List<Avaliacao> findByCuidadorOrderByDataAvaliacaoDesc(Cuidador cuidador);
    List<Avaliacao> findByCuidadorIdOrderByDataAvaliacaoDesc(Long cuidadorId);
}
