package br.pucgo.ads.projetointegrador.remember.repository;

import br.pucgo.ads.projetointegrador.remember.entity.UsuarioConquista;
import br.pucgo.ads.projetointegrador.remember.key.UsuarioConquistaKey;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UsuarioConquistaRepository extends JpaRepository<UsuarioConquista, UsuarioConquistaKey> {

    List<UsuarioConquista> findByUsuarioConquistaKey_IdentificadorUsuario(Long identificadorUsuario);
}