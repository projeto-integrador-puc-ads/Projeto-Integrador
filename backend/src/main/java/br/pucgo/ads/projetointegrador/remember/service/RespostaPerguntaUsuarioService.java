package br.pucgo.ads.projetointegrador.remember.service;

import br.pucgo.ads.projetointegrador.plataforma.Exception.RecursoNaoEncontradoException;
import br.pucgo.ads.projetointegrador.remember.domain.StatusPergunta;
import br.pucgo.ads.projetointegrador.remember.dto.Pergunta.RespostaPerguntaUsuarioRequestDTO;
import br.pucgo.ads.projetointegrador.remember.dto.Pergunta.RespostaPerguntaUsuarioResponseDTO;
import br.pucgo.ads.projetointegrador.remember.entity.PerguntaCognitiva;
import br.pucgo.ads.projetointegrador.remember.entity.RespostaPerguntaUsuario;
import br.pucgo.ads.projetointegrador.remember.repository.PerguntaCognitivaRepository;
import br.pucgo.ads.projetointegrador.remember.repository.RespostaPerguntaUsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class RespostaPerguntaUsuarioService {

    private final RespostaPerguntaUsuarioRepository respostaRepository;
    private final PerguntaCognitivaRepository perguntaRepository;

    /**
     * Salva a resposta de um usuário a uma pergunta cognitiva e atualiza o status da pergunta.
     * @param requestDTO O DTO contendo a resposta e os IDs necessários.
     * @return Os dados da resposta salva.
     */
    @Transactional
    public RespostaPerguntaUsuarioResponseDTO salvarResposta(RespostaPerguntaUsuarioRequestDTO requestDTO) {

        Long identificadorPergunta = requestDTO.getIdentificadorPergunta();
        Long identificadorUsuario = requestDTO.getIdentificadorUsuario();

        PerguntaCognitiva pergunta = perguntaRepository.findById(identificadorPergunta)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Pergunta não encontrada com o ID: " + identificadorPergunta));

        if (!pergunta.getIdentificadorUsuario().equals(identificadorUsuario)) {
            throw new SecurityException("Usuário não autorizado a responder esta pergunta.");
        }

        if (pergunta.getStatus().equals(StatusPergunta.RESPONDIDA.getCodigo())) {
            throw new IllegalStateException("Esta pergunta já foi respondida.");
        }

        RespostaPerguntaUsuario novaResposta = new RespostaPerguntaUsuario();
        novaResposta.setIdentificadorPergunta(identificadorPergunta);
        novaResposta.setIdentificadorUsuario(identificadorUsuario);
        novaResposta.setTextoResposta(requestDTO.getTextoResposta());

        RespostaPerguntaUsuario respostaSalva = respostaRepository.save(novaResposta);

        pergunta.setStatus(StatusPergunta.RESPONDIDA.getCodigo());
        perguntaRepository.save(pergunta);

        return new RespostaPerguntaUsuarioResponseDTO(respostaSalva);
    }
}