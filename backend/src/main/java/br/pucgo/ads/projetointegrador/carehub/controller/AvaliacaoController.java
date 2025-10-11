package br.pucgo.ads.projetointegrador.carehub.controller;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import br.pucgo.ads.projetointegrador.carehub.dto.avaliacao.AvaliacaoRequestDTO;
import br.pucgo.ads.projetointegrador.carehub.dto.avaliacao.AvaliacaoResponseDTO;
import br.pucgo.ads.projetointegrador.carehub.service.AvaliacaoService;

import java.util.List;

@RestController
@RequestMapping("/api/carehub/avaliacoes")
@CrossOrigin(origins = "*")
public class AvaliacaoController {

    @Autowired
    private AvaliacaoService avaliacaoService;

    @PostMapping
    public ResponseEntity<AvaliacaoResponseDTO> criarAvaliacao(
            @RequestHeader("X-User-Id") Long clienteId,
            @Valid @RequestBody AvaliacaoRequestDTO dto
    ) {
        AvaliacaoResponseDTO avaliacao = avaliacaoService.criarAvaliacao(clienteId, dto);
        return ResponseEntity.ok(avaliacao);
    }

    @GetMapping("/cuidador/{cuidadorId}")
    public ResponseEntity<List<AvaliacaoResponseDTO>> listarAvaliacoesCuidador(@PathVariable Long cuidadorId) {
        List<AvaliacaoResponseDTO> avaliacoes = avaliacaoService.listarAvaliacoesCuidador(cuidadorId);
        return ResponseEntity.ok(avaliacoes);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarAvaliacao(@PathVariable Long id) {
        avaliacaoService.deletarAvaliacao(id);
        return ResponseEntity.noContent().build();
    }
}
