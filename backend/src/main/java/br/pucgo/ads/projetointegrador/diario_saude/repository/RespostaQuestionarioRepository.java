package br.pucgo.ads.projetointegrador.diario_saude.repository;

import br.pucgo.ads.projetointegrador.diario_saude.entity.RespostaQuestionarioEntity;
import br.pucgo.ads.projetointegrador.diario_saude.entity.PerguntaEntity;
import br.pucgo.ads.projetointegrador.diario_saude.entity.UsuarioEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RespostaQuestionarioRepository extends JpaRepository<RespostaQuestionarioEntity, Long> {

    List<RespostaQuestionarioEntity> findByUsuario(UsuarioEntity usuario);

    Optional<RespostaQuestionarioEntity> findByUsuarioAndPergunta(UsuarioEntity usuario, PerguntaEntity pergunta);
}
