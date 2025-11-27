package br.pucgo.ads.projetointegrador.listaCompras.controller;

import br.pucgo.ads.projetointegrador.listaCompras.dto.PatologiaResponseDTO;
import br.pucgo.ads.projetointegrador.listaCompras.service.PatologiaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/lista-compras/patologias")
@RequiredArgsConstructor
public class PatologiaController {

    private final PatologiaService patologiaService;

    /**
     * GET /lista-compras/patologias?userId=123
     * Lista as patologias associadas a um usuário
     */
    @GetMapping
    public ResponseEntity<?> listarPorUsuario(@RequestParam("userId") Long userId) {
        try {
            List<PatologiaResponseDTO> patologias = patologiaService.listarPorUsuario(userId);
            return ResponseEntity.ok(patologias);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("erro", "Erro interno ao listar patologias"));
        }
    }
}
