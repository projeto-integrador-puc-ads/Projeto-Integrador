package br.pucgo.ads.projetointegrador.remember.repository;

import br.pucgo.ads.projetointegrador.remember.entity.Diario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface DiarioRepository extends JpaRepository<Diario, Long> {

    List<Diario> findAllByIdentificadorUsuarioOrderByDataEscritaDesc(Long identificadorUsuario);

    List<Diario> findAllByIdentificadorUsuarioAndDataCriacaoBetween(Long identificadorUsuario, LocalDateTime dataInicio, LocalDateTime dataFim);
}
