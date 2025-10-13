package br.pucgo.ads.projetointegrador.plataforma.repository;

import br.pucgo.ads.projetointegrador.plataforma.entity.Lembranca;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface LembrancaRepository extends JpaRepository<Lembranca, UUID> {

    List<Lembranca> findAllByIdentificadorUsuarioOrderByDataAcontecimentoDesc(UUID identificadorUsuario);

}
