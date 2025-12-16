package br.pucgo.ads.projetointegrador.listaCompras.controller;

import br.pucgo.ads.projetointegrador.listaCompras.dto.PatologiaItemRequestDTO;
import br.pucgo.ads.projetointegrador.listaCompras.dto.PatologiaItemResponseDTO;
import br.pucgo.ads.projetointegrador.listaCompras.service.PatologiaItemService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Patologia Itens", description = "Endpoints para gerenciar vínculos entre patologias e itens/produtos.")
@RestController
@RequestMapping("/lista-compras/patologia-itens")
@RequiredArgsConstructor
public class PatologiaItemController {

    private final PatologiaItemService service;

    @Operation(
            summary = "Vincular item a patologia",
            description = "Cria um vínculo entre uma patologia e um item/produto conforme regras do serviço."
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Vínculo criado com sucesso",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = PatologiaItemResponseDTO.class))
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Requisição inválida / regra de negócio",
                    content = @Content(mediaType = "application/json",
                            examples = @ExampleObject(value = "{\"erro\":\"Dados inválidos\"}"))
            ),
            @ApiResponse(
                    responseCode = "500",
                    description = "Erro interno",
                    content = @Content(mediaType = "application/json",
                            examples = @ExampleObject(value = "{\"erro\":\"Erro interno\"}"))
            )
    })
    @PostMapping(consumes = "application/json", produces = "application/json")
    public ResponseEntity<PatologiaItemResponseDTO> vincular(
            @RequestBody PatologiaItemRequestDTO dto
    ) {
        PatologiaItemResponseDTO novoVinculo = service.vincular(dto);
        return ResponseEntity.ok(novoVinculo);
    }

    @Operation(
            summary = "Listar vínculos por patologia",
            description = "Retorna os itens/produtos vinculados a uma patologia específica."
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Lista de vínculos retornada",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = PatologiaItemResponseDTO.class))
            )
    })
    @GetMapping("/patologia/{patologiaId}")
    public ResponseEntity<List<PatologiaItemResponseDTO>> listarPorPatologia(
            @Parameter(description = "ID da patologia", required = true, example = "5")
            @PathVariable Long patologiaId
    ) {
        return ResponseEntity.ok(service.listarPorPatologia(patologiaId));
    }
}
