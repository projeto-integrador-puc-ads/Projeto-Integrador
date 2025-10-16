package br.pucgo.ads.projetointegrador.remember.repository;

import br.pucgo.ads.projetointegrador.remember.entity.PerguntaTemplate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PerguntaTemplateRepository extends JpaRepository<PerguntaTemplate, Long> {

    List<PerguntaTemplate> findByAtivoTrueAndGatilhoTipo(Integer gatilhoTipo);
}
