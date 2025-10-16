package br.pucgo.ads.projetointegrador.remember.repository;

import br.pucgo.ads.projetointegrador.remember.entity.RespostaPerguntaUsuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RespostaPerguntaUsuarioRepository extends JpaRepository<RespostaPerguntaUsuario, Long> {

}
