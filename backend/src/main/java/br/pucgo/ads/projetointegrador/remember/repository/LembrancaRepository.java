package br.pucgo.ads.projetointegrador.remember.repository;

import br.pucgo.ads.projetointegrador.remember.entity.Lembranca;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface LembrancaRepository extends JpaRepository<Lembranca, Long> {

    List<Lembranca> findAllByIdentificadorUsuarioOrderByDataAcontecimentoDesc(Long identificadorUsuario);

    List<Lembranca> findAllByIdentificadorUsuarioAndDataCriacaoBetween(Long identificadorUsuario, LocalDateTime dataInicio, LocalDateTime dataFim);

    long countByIdentificadorUsuario(Long identificadorUsuario);
}
