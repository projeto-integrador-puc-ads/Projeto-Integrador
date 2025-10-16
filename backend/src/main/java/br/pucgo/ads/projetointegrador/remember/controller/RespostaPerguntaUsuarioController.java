package br.pucgo.ads.projetointegrador.remember.controller;

import br.pucgo.ads.projetointegrador.remember.dto.Pergunta.RespostaPerguntaUsuarioRequestDTO;
import br.pucgo.ads.projetointegrador.remember.dto.Pergunta.RespostaPerguntaUsuarioResponseDTO;
import br.pucgo.ads.projetointegrador.remember.service.RespostaPerguntaUsuarioService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;

@RestController
@RequestMapping("/api/respostas-perguntas-usuarios")
@RequiredArgsConstructor
public class RespostaPerguntaUsuarioController {

    private final RespostaPerguntaUsuarioService respostaService;

    /**
     * Envia a resposta para uma pergunta cognitiva.
     * A pergunta a ser respondida é especificada no corpo da requisição.
     */
    @PostMapping
    public ResponseEntity<RespostaPerguntaUsuarioResponseDTO> salvarResposta(
            @Valid @RequestBody RespostaPerguntaUsuarioRequestDTO requestDTO
    ) {
        try {
            RespostaPerguntaUsuarioResponseDTO respostaSalva = respostaService.salvarResposta(requestDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(respostaSalva);
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }
    }
}
