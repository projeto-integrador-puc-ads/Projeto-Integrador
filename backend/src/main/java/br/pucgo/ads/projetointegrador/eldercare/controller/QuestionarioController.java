package br.pucgo.ads.projetointegrador.eldercare.controller;

import br.pucgo.ads.projetointegrador.eldercare.domain.PlanoExercicio;
import br.pucgo.ads.projetointegrador.eldercare.dto.GerarPlanoRequest;
import br.pucgo.ads.projetointegrador.eldercare.service.PlanoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/eldercare/questionario")
public class QuestionarioController {

    private final PlanoService planoService;

    public QuestionarioController(PlanoService planoService) {
        this.planoService = planoService;
    }

    @PostMapping("/gerar")
    public ResponseEntity<PlanoExercicio> gerar(@RequestBody GerarPlanoRequest req) {
        var plano = planoService.gerarPlano(req);
        return ResponseEntity.status(201).body(plano);
    }

    // Retorna 400 com mensagem amigável quando alguma resposta tem valor inválido
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, String>> handleBadRequest(IllegalArgumentException ex) {
        return ResponseEntity.badRequest().body(Map.of("error", ex.getMessage()));
    }
}
