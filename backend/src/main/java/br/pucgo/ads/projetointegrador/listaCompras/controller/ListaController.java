package br.pucgo.ads.projetointegrador.listaCompras.controller;

import br.pucgo.ads.projetointegrador.listaCompras.dto.ListaCreateRequestDTO;
import br.pucgo.ads.projetointegrador.listaCompras.dto.ListaResponseDTO;
import br.pucgo.ads.projetointegrador.listaCompras.service.ListaService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Tag(name = "Listas", description = "Endpoints para criar e gerenciar listas de compras.")
@RestController
@RequestMapping("/lista-compras/listas")
@RequiredArgsConstructor
public class ListaController {

    private final ListaService listaService;

    @Operation(
            summary = "Criar lista de compras",
            description = "Cria uma nova lista de compras associada a um usuário."
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Lista criada com sucesso",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ListaResponseDTO.class))
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Erro de validação ou dados inválidos",
                    content = @Content(mediaType = "application/json",
                            examples = @ExampleObject(value = "{\"erro\":\"Dados inválidos\"}"))
            ),
            @ApiResponse(
                    responseCode = "500",
                    description = "Erro interno ao criar lista",
                    content = @Content(mediaType = "application/json",
                            examples = @ExampleObject(value = "{\"erro\":\"Erro interno ao criar a lista\"}"))
            )
    })
    @PostMapping
    public ResponseEntity<?> criarLista(
            @Parameter(description = "ID do usuário que solicita a lista", required = true, example = "123")
            @RequestParam("userId") Long userId,
            @Valid @RequestBody ListaCreateRequestDTO dto
    ) {
        try {
            ListaResponseDTO resposta = listaService.criarComItens(userId, dto);
            return ResponseEntity.ok(resposta);
        } catch (IllegalArgumentException e) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("erro", e.getMessage()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("erro", "Erro interno ao criar a lista"));
        }
    }

    @Operation(
            summary = "Listar listas de compras do usuário",
            description = "Lista as listas associadas a um usuário específico."
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Listas do usuário retornadas com sucesso",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ListaResponseDTO.class))
            )
    })
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
    // O restante segue a mesma estrutura
}
