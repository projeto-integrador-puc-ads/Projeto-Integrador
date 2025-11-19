package br.pucgo.ads.projetointegrador.diario_saude.service;

import br.pucgo.ads.projetointegrador.diario_saude.entity.RespostaQuestionarioEntity;
import br.pucgo.ads.projetointegrador.diario_saude.entity.UsuarioEntity;
import br.pucgo.ads.projetointegrador.diario_saude.repository.RespostaQuestionarioRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class RespostaQuestionarioService {

    private final RespostaQuestionarioRepository respostaRepository;

    public RespostaQuestionarioService(RespostaQuestionarioRepository respostaRepository) {
        this.respostaRepository = respostaRepository;
    }

    public List<RespostaQuestionarioEntity> buscarPorUsuario(UsuarioEntity usuario) {
        return respostaRepository.findByUsuario(usuario);
    }

    @Transactional
    public void salvarRespostas(List<RespostaQuestionarioEntity> respostas) {
        for (RespostaQuestionarioEntity r : respostas) {
            // verifica se já existe uma resposta para esse usuário e pergunta
            RespostaQuestionarioEntity existente = respostaRepository
                    .findByUsuarioAndPergunta(r.getUsuario(), r.getPergunta())
                    .orElse(null);

            if (existente != null) {
                // atualiza se já existir
                existente.setResposta(r.getResposta());
                existente.setPeso(r.getPeso());
                respostaRepository.save(existente);
            } else {
                respostaRepository.save(r);
            }
        }
    }

    public int calcularPontuacaoTotal(UsuarioEntity usuario) {
        List<RespostaQuestionarioEntity> respostas = buscarPorUsuario(usuario);
        return respostas.stream().mapToInt(RespostaQuestionarioEntity::getPeso).sum();
    }
}
