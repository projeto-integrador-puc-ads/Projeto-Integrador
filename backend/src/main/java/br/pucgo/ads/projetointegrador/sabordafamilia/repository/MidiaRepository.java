package br.pucgo.ads.projetointegrador.sabordafamilia.repository;

import br.pucgo.ads.projetointegrador.sabordafamilia.entity.Midia;
import org.springframework.data.jpa.repository.JpaRepository;

// Este repositório gerencia a entidade Midia
public interface MidiaRepository extends JpaRepository<Midia, Long> {
}