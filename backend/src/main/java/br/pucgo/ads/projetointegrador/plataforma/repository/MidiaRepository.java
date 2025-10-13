package br.pucgo.ads.projetointegrador.plataforma.repository;

import br.pucgo.ads.projetointegrador.plataforma.entity.Midia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;


@Repository
public interface MidiaRepository extends JpaRepository<Midia, UUID> {

}
