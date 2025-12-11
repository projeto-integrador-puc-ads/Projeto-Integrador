package br.pucgo.ads.projetointegrador.remember.controller;

import br.pucgo.ads.projetointegrador.remember.dto.conquista.ConquistaRequestDTO;
import br.pucgo.ads.projetointegrador.remember.dto.conquista.ConquistaRequestEditDTO;
import br.pucgo.ads.projetointegrador.remember.dto.conquista.ConquistaResponseDTO;
import br.pucgo.ads.projetointegrador.remember.service.ConquistaService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/conquistas")
public class ConquistaController {

    private final ConquistaService conquistaService;

    @Autowired
    public ConquistaController(ConquistaService conquistaService) {
        this.conquistaService = conquistaService;
    }

    /**
     * Cria uma definição de conquista.
     * Endpoint tipicamente restrito a administradores.
     */
    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ConquistaResponseDTO> salvarConquista(@Valid @RequestBody ConquistaRequestDTO requestDTO) {
        ConquistaResponseDTO novaConquista = conquistaService.salvarConquista(requestDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(novaConquista);
    }

    /**
     * Busca uma conquista específica pelo seu identificador.
     */
    @GetMapping("/{identificador}")
    public ResponseEntity<ConquistaResponseDTO> buscarConquistaPorId(@PathVariable Long identificador) {
        ConquistaResponseDTO conquista = conquistaService.buscarConquistaPorId(identificador);
        return ResponseEntity.ok(conquista);
    }

    /**
     * Lista todas as conquistas disponíveis no sistema.
     */
    @GetMapping
    public ResponseEntity<List<ConquistaResponseDTO>> listarConquistas() {
        List<ConquistaResponseDTO> conquistas = conquistaService.listarConquistas();
        return ResponseEntity.ok(conquistas);
    }

    /**
     * Atualiza uma conquista existente.
     * Endpoint tipicamente restrito a administradores.
     */
    @PutMapping("/{identificador}")
    public ResponseEntity<ConquistaResponseDTO> atualizarConquista(
            @PathVariable Long identificador,
            @Valid @RequestBody ConquistaRequestEditDTO requestDTO
    ) {
        ConquistaResponseDTO conquistaAtualizada = conquistaService.atualizarConquista(identificador, requestDTO);
        return ResponseEntity.ok(conquistaAtualizada);
    }

    /**
     * Deleta uma conquista do sistema.
     * Endpoint tipicamente restrito a administradores.
     */
    @DeleteMapping("/{identificador}")
    public ResponseEntity<Void> deletarConquista(@PathVariable Long identificador) {
        conquistaService.deletarConquista(identificador);
        return ResponseEntity.noContent().build();
    }
}