package br.pucgo.ads.projetointegrador.remember.controller;

import br.pucgo.ads.projetointegrador.remember.dto.lembranca.LembrancaRequestDTO;
import br.pucgo.ads.projetointegrador.remember.dto.lembranca.LembrancaResponseDTO;
import br.pucgo.ads.projetointegrador.remember.dto.lembranca.LembrancaUpdateDTO;
import br.pucgo.ads.projetointegrador.remember.service.LembrancaService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/lembrancas")
public class LembrancaController {

    private final LembrancaService lembrancaService;

    @Autowired
    public LembrancaController(LembrancaService lembrancaService) {
        this.lembrancaService = lembrancaService;
    }

    @PostMapping
    public ResponseEntity<LembrancaResponseDTO> salvarLembranca(@Valid @RequestBody LembrancaRequestDTO requestDTO) {
        LembrancaResponseDTO novaLembranca = lembrancaService.salvarLembranca(requestDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(novaLembranca);
    }

    @GetMapping("/{identificador}")
    public ResponseEntity<LembrancaResponseDTO> buscarLembrancaPorId(@PathVariable Long identificador) {
        LembrancaResponseDTO lembranca = lembrancaService.buscarLembrancaPorId(identificador);
        return ResponseEntity.ok(lembranca);
    }

    @GetMapping("/usuario/{identificadorUsuario}")
    public ResponseEntity<List<LembrancaResponseDTO>> listarLembrancasPorUsuario(@PathVariable Long identificadorUsuario) {
        List<LembrancaResponseDTO> lembrancas = lembrancaService.listarLembrancasPorUsuario(identificadorUsuario);
        return ResponseEntity.ok(lembrancas);
    }

    @PutMapping("/{identificador}")
    public ResponseEntity<LembrancaResponseDTO> atualizarLembranca(
            @PathVariable Long identificador,
            @Valid @RequestBody LembrancaUpdateDTO lembrancaUpdateDto
    ) {
        LembrancaResponseDTO lembrancaAtualizada = lembrancaService.atualizarLembranca(identificador, lembrancaUpdateDto);
        return ResponseEntity.ok(lembrancaAtualizada);
    }

    @DeleteMapping("/{identificador}")
    public ResponseEntity<Void> deletarLembranca(@PathVariable Long identificador) {
        lembrancaService.deletarLembranca(identificador);
        return ResponseEntity.noContent().build();
    }
}
