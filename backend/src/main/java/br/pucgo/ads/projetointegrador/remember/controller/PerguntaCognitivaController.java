package br.pucgo.ads.projetointegrador.remember.controller;

import br.pucgo.ads.projetointegrador.remember.dto.Pergunta.PerguntaCognitivaResponseDTO;
import br.pucgo.ads.projetointegrador.remember.service.PerguntaCognitivaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/perguntas-cognitivas")
@RequiredArgsConstructor
public class PerguntaCognitivaController {

    private final PerguntaCognitivaService perguntaService;

    /**
     * Busca as perguntas pendentes (não respondidas) para um usuário específico.
     * O frontend usaria o ID do usuário logado para fazer esta requisição.
     */
    @GetMapping("/pendentes")
    public ResponseEntity<List<PerguntaCognitivaResponseDTO>> listarPerguntasPendentes(
            @RequestParam("usuarioId") Long identificadorUsuario
    ) {
        List<PerguntaCognitivaResponseDTO> perguntas = perguntaService.listarPerguntasPendentesPorUsuario(identificadorUsuario);
        return ResponseEntity.ok(perguntas);
    }
}
