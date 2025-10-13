package br.pucgo.ads.projetointegrador.plataforma.controller;

import br.pucgo.ads.projetointegrador.plataforma.dto.lembranca.LembrancaRequestDTO;
import br.pucgo.ads.projetointegrador.plataforma.dto.lembranca.LembrancaResponseDTO;
import br.pucgo.ads.projetointegrador.plataforma.service.LembrancaService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

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
    public ResponseEntity<LembrancaResponseDTO> buscarLembrancaPorId(@PathVariable UUID identificador) {
        LembrancaResponseDTO lembranca = lembrancaService.buscarLembrancaPorIdentificador(identificador);
        return ResponseEntity.ok(lembranca);
    }

    @GetMapping("/usuario/{identificadorUsuario}")
    public ResponseEntity<List<LembrancaResponseDTO>> listarLembrancasPorUsuario(@PathVariable UUID identificadorUsuario) {
        List<LembrancaResponseDTO> lembrancas = lembrancaService.listarLembrancasPorUsuario(identificadorUsuario);
        return ResponseEntity.ok(lembrancas);
    }

    @PutMapping("/{identificador}")
    public ResponseEntity<LembrancaResponseDTO> atualizarLembranca(@PathVariable UUID identificador, @Valid @RequestBody LembrancaRequestDTO requestDTO) {
        LembrancaResponseDTO lembrancaAtualizada = lembrancaService.atualizarLembranca(identificador, requestDTO);
        return ResponseEntity.ok(lembrancaAtualizada);
    }

    @DeleteMapping("/{identificador}")
    public ResponseEntity<Void> deletarLembranca(@PathVariable UUID identificador) {
        lembrancaService.deletarLembranca(identificador);
        return ResponseEntity.noContent().build();
    }
}
