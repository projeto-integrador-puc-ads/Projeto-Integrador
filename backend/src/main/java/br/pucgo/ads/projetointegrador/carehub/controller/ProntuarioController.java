package br.pucgo.ads.projetointegrador.carehub.controller;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import br.pucgo.ads.projetointegrador.carehub.dto.prontuario.ProntuarioRequestDTO;
import br.pucgo.ads.projetointegrador.carehub.dto.prontuario.ProntuarioResponseDTO;
import br.pucgo.ads.projetointegrador.carehub.service.ProntuarioService;

@RestController
@RequestMapping("/api/carehub/prontuarios")
@CrossOrigin(origins = "*")
public class ProntuarioController {

    @Autowired
    private ProntuarioService prontuarioService;

    @PostMapping
    public ResponseEntity<ProntuarioResponseDTO> criarProntuario(
            @Valid @RequestBody ProntuarioRequestDTO dto
    ) {
        ProntuarioResponseDTO prontuario = prontuarioService.criarProntuario(dto);
        return ResponseEntity.ok(prontuario);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProntuarioResponseDTO> atualizarProntuario(
            @PathVariable Long id,
            @Valid @RequestBody ProntuarioRequestDTO dto
    ) {
        ProntuarioResponseDTO prontuario = prontuarioService.atualizarProntuario(id, dto);
        return ResponseEntity.ok(prontuario);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProntuarioResponseDTO> buscarPorId(@PathVariable Long id) {
        ProntuarioResponseDTO prontuario = prontuarioService.buscarPorId(id);
        return ResponseEntity.ok(prontuario);
    }

    @GetMapping("/cliente/{clienteId}")
    public ResponseEntity<ProntuarioResponseDTO> buscarPorCliente(@PathVariable Long clienteId) {
        ProntuarioResponseDTO prontuario = prontuarioService.buscarPorClienteId(clienteId);
        return ResponseEntity.ok(prontuario);
    }
}
