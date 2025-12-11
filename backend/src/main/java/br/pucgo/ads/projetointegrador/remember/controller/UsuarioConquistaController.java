package br.pucgo.ads.projetointegrador.remember.controller;

import br.pucgo.ads.projetointegrador.remember.dto.conquista.RankingResponseDTO;
import br.pucgo.ads.projetointegrador.remember.dto.conquista.UsuarioConquistaRequestDTO;
import br.pucgo.ads.projetointegrador.remember.dto.conquista.UsuarioConquistaResponseDTO;
import br.pucgo.ads.projetointegrador.remember.service.UsuarioConquistaService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/usuario-conquistas")
public class UsuarioConquistaController {

    private final UsuarioConquistaService usuarioConquistaService;

    @Autowired
    public UsuarioConquistaController(UsuarioConquistaService usuarioConquistaService) {
        this.usuarioConquistaService = usuarioConquistaService;
    }

    /**
     * Lista todas as conquistas que um usuário específico ganhou.
     */
    @GetMapping("/{identificadorUsuario}")
    public ResponseEntity<List<UsuarioConquistaResponseDTO>> listarConquistasPorUsuario(
            @PathVariable Long identificadorUsuario
    ) {
        List<UsuarioConquistaResponseDTO> conquistasDoUsuario =
                usuarioConquistaService.listarConquistasPorUsuario(identificadorUsuario);
        return ResponseEntity.ok(conquistasDoUsuario);
    }

    @GetMapping("/ranking")
    public ResponseEntity<List<RankingResponseDTO>> getRanking() {
        return ResponseEntity.ok(usuarioConquistaService.buscarTop3Ranking());
    }

    /**
     * Concede uma nova conquista a um usuário.
     * Este endpoint seria chamado pelo sistema (quando uma regra é atingida) ou por um administrador.
     */
    @PostMapping
    public ResponseEntity<UsuarioConquistaResponseDTO> concederConquista(
            @Valid @RequestBody UsuarioConquistaRequestDTO requestDTO
    ) {
        UsuarioConquistaResponseDTO conquistaConcedida = usuarioConquistaService.concederConquista(
                requestDTO.getIdentificadorUsuario(), requestDTO.getIdentificadorConquista());
        return ResponseEntity.status(HttpStatus.CREATED).body(conquistaConcedida);
    }
}
