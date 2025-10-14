package br.pucgo.ads.projetointegrador.remember.controller;

import br.pucgo.ads.projetointegrador.remember.dto.diario.DiarioRequestDTO;
import br.pucgo.ads.projetointegrador.remember.dto.diario.DiarioResponseDTO;
import br.pucgo.ads.projetointegrador.remember.service.DiarioService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/diarios")
public class DiarioController {

    private final DiarioService diarioService;

    @Autowired
    public DiarioController(DiarioService diarioService) {
        this.diarioService = diarioService;
    }

    @PostMapping
    public ResponseEntity<DiarioResponseDTO> salvarDiario(@Valid @RequestBody DiarioRequestDTO requestDTO) {
        DiarioResponseDTO novoDiario = diarioService.salvarDiario(requestDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(novoDiario);
    }

    @GetMapping("/{identificador}")
    public ResponseEntity<DiarioResponseDTO> buscarDiarioPorId(@PathVariable Long identificador) {
        DiarioResponseDTO diario = diarioService.buscarDiarioPorId(identificador);
        return ResponseEntity.ok(diario);
    }

    @GetMapping("/usuario/{identificadorUsuario}")
    public ResponseEntity<List<DiarioResponseDTO>> listarDiariosPorUsuario(@PathVariable Long identificadorUsuario) {
        List<DiarioResponseDTO> diarios = diarioService.listarDiariosPorUsuario(identificadorUsuario);
        return ResponseEntity.ok(diarios);
    }

    @PutMapping("/{identificador}")
    public ResponseEntity<DiarioResponseDTO> atualizarDiario(
            @PathVariable Long identificador,
            @Valid @RequestBody DiarioRequestDTO requestDTO
    ) {
        DiarioResponseDTO diarioAtualizado = diarioService.atualizarDiario(identificador, requestDTO);
        return ResponseEntity.ok(diarioAtualizado);
    }

    @DeleteMapping("/{identificador}")
    public ResponseEntity<Void> deletarDiario(@PathVariable Long identificador) {
        diarioService.deletarDiario(identificador);
        return ResponseEntity.noContent().build();
    }
}
