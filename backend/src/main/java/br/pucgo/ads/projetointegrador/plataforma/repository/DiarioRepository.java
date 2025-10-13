package br.pucgo.ads.projetointegrador.plataforma.repository;

import br.pucgo.ads.projetointegrador.plataforma.entity.Diario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface DiarioRepository extends JpaRepository<Diario, UUID> {

    List<Diario> findAllByIdentificadorUsuarioOrderByDataEscritaDesc(UUID identificadorUsuario);

}
