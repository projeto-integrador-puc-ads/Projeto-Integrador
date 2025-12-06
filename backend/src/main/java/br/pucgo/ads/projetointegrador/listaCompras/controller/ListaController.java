package br.pucgo.ads.projetointegrador.listaCompras.controller;

import br.pucgo.ads.projetointegrador.listaCompras.dto.ListaCreateRequestDTO;
import br.pucgo.ads.projetointegrador.listaCompras.dto.ListaResponseDTO;
import br.pucgo.ads.projetointegrador.listaCompras.service.ListaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/lista-compras/listas")
@RequiredArgsConstructor
public class ListaController {

    private final ListaService listaService;

    /**
     * POST /api/lista-compras/listas?userId=123
     * Body: { "titulo": "...", "itens": [ { "produtoId": 1, "qtd": 2 }, ... ] }
     */
    @PostMapping
    public ResponseEntity<?> criarLista(
            @RequestParam("userId") Long userId,
            @Valid @RequestBody ListaCreateRequestDTO dto
    ) {
        try {
            ListaResponseDTO resposta = listaService.criarComItens(userId, dto);
            return ResponseEntity.ok(resposta);

        } catch (IllegalArgumentException e) {
            // Erros de regra de negócio / validações manuais
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("erro", e.getMessage()));

        } catch (Exception e) {
            // Qualquer erro inesperado
            e.printStackTrace(); // ou logar com logger
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("erro", "Erro interno ao criar a lista"));
        }
    }

    /**
     * GET /lista-compras/listas/usuario/{userId}
     * Lista somente listas normais do usuário (template = false)
     */
    @GetMapping("/usuario/{userId}")
    public ResponseEntity<?> listarListasDoUsuario(@PathVariable Long userId) {
        try {
            List<ListaResponseDTO> listas = listaService.listarListasNormais(userId);
            return ResponseEntity.ok(listas);

        } catch (IllegalArgumentException e) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("erro", e.getMessage()));

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("erro", "Erro interno ao listar listas do usuário"));
        }
    }

    /**
     * GET /lista-compras/listas/templates
     * Lista todos os templates disponíveis (template = true)
     */
    @GetMapping("/templates")
    public ResponseEntity<?> listarTemplates(@RequestParam("userId") Long userId) {
        try {
            List<ListaResponseDTO> templates = listaService.listarTemplates(userId);
            return ResponseEntity.ok(templates);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("erro", "Erro interno ao listar templates"));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> buscarPorId(@PathVariable Long id) {
        try {
            ListaResponseDTO lista = listaService.buscarPorId(id);
            return ResponseEntity.ok(lista);

        } catch (IllegalArgumentException e) {
            // quando o service lançar "Lista não encontrada..."
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(Map.of("erro", e.getMessage()));

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("erro", "Erro interno ao buscar lista"));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> atualizarLista(
            @PathVariable Long id,
            @Valid @RequestBody ListaCreateRequestDTO dto
    ) {
        try {
            ListaResponseDTO resposta = listaService.atualizarLista(id, dto);
            return ResponseEntity.ok(resposta);

        } catch (IllegalArgumentException e) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("erro", e.getMessage()));

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("erro", "Erro interno ao atualizar a lista"));
        }
    }

    @PutMapping("/{id}/finalizar")
    public ResponseEntity<?> finalizarLista(@PathVariable Long id) {
        try {
            ListaResponseDTO resposta = listaService.finalizarLista(id);
            return ResponseEntity.ok(resposta);

        } catch (IllegalArgumentException e) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("erro", e.getMessage()));

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("erro", "Erro interno ao finalizar a lista"));
        }
    }

    @PutMapping("/{id}/reabrir")
    public ResponseEntity<?> reabrirLista(@PathVariable Long id) {
        try {
            ListaResponseDTO resposta = listaService.reabrirLista(id);
            return ResponseEntity.ok(resposta);

        } catch (IllegalArgumentException e) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("erro", e.getMessage()));

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("erro", "Erro interno ao reabrir a lista"));
        }
    }
}
