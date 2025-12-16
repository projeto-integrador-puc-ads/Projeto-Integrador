package br.pucgo.ads.projetointegrador.listaCompras.controller;

import br.pucgo.ads.projetointegrador.listaCompras.dto.PatologiaResponseDTO;
import br.pucgo.ads.projetointegrador.listaCompras.service.PatologiaService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Tag(name = "Patologias", description = "Endpoints para consulta de patologias vinculadas ao usuário.")
@RestController
@RequestMapping("/lista-compras/patologias")
@RequiredArgsConstructor
public class PatologiaController {

    private final PatologiaService patologiaService;

    @Operation(
            summary = "Listar patologias do usuário",
            description = "Retorna as patologias associadas a um usuário específico (informado por userId)."
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Lista de patologias retornada com sucesso",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = PatologiaResponseDTO.class))
            ),
            @ApiResponse(
                    responseCode = "500",
                    description = "Erro interno ao listar patologias",
                    content = @Content(mediaType = "application/json",
                            examples = @ExampleObject(value = "{\"erro\":\"Erro interno ao listar patologias\"}"))
            )
    })
    @GetMapping
    public ResponseEntity<?> listarPorUsuario(
            @Parameter(description = "ID do usuário", required = true, example = "123")
            @RequestParam("userId") Long userId
    ) {
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

    @Operation(
            summary = "Buscar patologia por ID",
            description = "Retorna os dados de uma patologia a partir do seu identificador."
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Patologia encontrada",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = PatologiaResponseDTO.class))
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Patologia não encontrada",
                    content = @Content(mediaType = "application/json",
                            examples = @ExampleObject(value = "{\"erro\":\"Patologia não encontrada\"}"))
            ),
            @ApiResponse(
                    responseCode = "500",
                    description = "Erro interno ao buscar patologia",
                    content = @Content(mediaType = "application/json",
                            examples = @ExampleObject(value = "{\"erro\":\"Erro interno ao buscar patologia\"}"))
            )
    })
    @GetMapping("/{id}")
    public ResponseEntity<?> buscarPorId(
            @Parameter(description = "ID da patologia", required = true, example = "10")
            @PathVariable Long id
    ) {
        try {
            PatologiaResponseDTO dto = patologiaService.buscarPorId(id);
            return ResponseEntity.ok(dto);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("erro", e.getMessage()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("erro", "Erro interno ao buscar patologia"));
        }
    }
}
