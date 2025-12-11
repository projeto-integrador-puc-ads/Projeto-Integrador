package br.pucgo.ads.projetointegrador.remember.repository;

import br.pucgo.ads.projetointegrador.remember.entity.Conquista;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ConquistaRepository extends JpaRepository<Conquista, Long> {

    List<Conquista> findByTipo(Integer tipo);
}
