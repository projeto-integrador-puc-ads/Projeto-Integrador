package br.pucgo.ads.projetointegrador.listaCompras.repository;

import java.util.Optional;

import br.pucgo.ads.projetointegrador.listaCompras.entity.Patologia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PatologiaRepository extends JpaRepository<Patologia, Long> {

    //Optional<Patologia> findByPatologiasId(Long patologiaId);

}
