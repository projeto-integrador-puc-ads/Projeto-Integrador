package br.pucgo.ads.projetointegrador.listaCompras.controller;

import br.pucgo.ads.projetointegrador.listaCompras.dto.ProdutoRelacionadoResponseDTO;
import br.pucgo.ads.projetointegrador.listaCompras.dto.ProdutoResponseDTO;
import br.pucgo.ads.projetointegrador.listaCompras.dto.ProdutoSubstituivelResponseDTO;
import br.pucgo.ads.projetointegrador.listaCompras.service.PatologiaItemService;
import br.pucgo.ads.projetointegrador.listaCompras.service.ProdutoRelacionadoService;
import br.pucgo.ads.projetointegrador.listaCompras.service.ProdutoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.media.Schema;


import java.util.List;

@Tag(name = "Produtos", description = "Endpoints para consulta de produtos, relacionados e sugestões de substituição.")
@RestController
@RequestMapping("/lista-compras/produtos")
@RequiredArgsConstructor
public class ProdutoController {

    private final ProdutoService produtoService;
    private final ProdutoRelacionadoService produtoRelacionadoService;
    private final PatologiaItemService patologiaItemService;

    @Operation(
            summary = "Listar produtos ativos",
            description = "Retorna a lista de produtos ativos disponíveis no sistema."
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Produtos retornados com sucesso",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ProdutoResponseDTO.class))
            )
    })
    @GetMapping
    public ResponseEntity<List<ProdutoResponseDTO>> listarTodos() {
        List<ProdutoResponseDTO> produtos = produtoService.listarAtivos();
        return ResponseEntity.ok(produtos);
    }

    @Operation(
            summary = "Listar produtos relacionados (afinidade)",
            description = "Retorna produtos relacionados ao produto informado (por afinidade), normalmente ordenados por relevância."
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Relacionados retornados com sucesso",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ProdutoRelacionadoResponseDTO.class))
            )
    })
    @GetMapping("/{id}/relacionados")
    public ResponseEntity<List<ProdutoRelacionadoResponseDTO>> listarProdutosRelacionados(
            @Parameter(description = "ID do produto base", required = true, example = "10")
            @PathVariable Long id
    ) {
        List<ProdutoRelacionadoResponseDTO> relacionados = produtoRelacionadoService.listarProdutosRelacionados(id);
        return ResponseEntity.ok(relacionados);
    }

    @Operation(
            summary = "Listar produtos substituíveis (por usuário)",
            description = "Sugere substitutos para um produto alertado, considerando as patologias do usuário. Use quando existir alerta de patologia."
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Substitutos retornados com sucesso",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ProdutoSubstituivelResponseDTO.class))
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Parâmetros inválidos / regra de negócio",
                    content = @Content(mediaType = "application/json",
                            examples = @ExampleObject(value = "{\"erro\":\"userId inválido\"}"))
            )
    })
    @GetMapping("/{id}/substituiveis")
    public ResponseEntity<List<ProdutoSubstituivelResponseDTO>> listarProdutosSubstituiveis(
            @Parameter(description = "ID do produto alertado", required = true, example = "10")
            @PathVariable Long id,
            @Parameter(description = "ID do usuário (para verificar patologias)", required = true, example = "1")
            @RequestParam Long userId
    ) {
        List<ProdutoSubstituivelResponseDTO> substituiveis =
                patologiaItemService.listarProdutosSubstituiveis(userId, id);
        return ResponseEntity.ok(substituiveis);
    }

    @Operation(
            summary = "Buscar produtos (autocomplete)",
            description = "Busca produtos pelo nome contendo o texto informado. Retorna no máximo 5 correspondências."
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Produtos encontrados",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ProdutoResponseDTO.class))
            )
    })
    @GetMapping("/buscar")
    public ResponseEntity<List<ProdutoResponseDTO>> buscarProdutos(
            @Parameter(description = "Texto parcial do nome do produto", required = true, example = "leite")
            @RequestParam String param
    ) {
        List<ProdutoResponseDTO> produtos = produtoService.buscarPorNome(param);
        return ResponseEntity.ok(produtos);
    }

    @Operation(
            summary = "Listar substituíveis por patologia específica",
            description = "Sugere substitutos para um produto base, considerando uma patologia específica (patologiaId)."
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Substitutos retornados com sucesso",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ProdutoSubstituivelResponseDTO.class))
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Parâmetros inválidos / regra de negócio",
                    content = @Content(mediaType = "application/json",
                            examples = @ExampleObject(value = "{\"erro\":\"patologiaId inválido\"}"))
            )
    })
    @GetMapping("/{id}/substituiveis-por-patologia")
    public ResponseEntity<List<ProdutoSubstituivelResponseDTO>> listarProdutosSubstituiveisPorPatologia(
            @Parameter(description = "ID do produto base", required = true, example = "10")
            @PathVariable Long id,
            @Parameter(description = "ID da patologia para filtragem", required = true, example = "3")
            @RequestParam Long patologiaId
    ) {
        List<ProdutoSubstituivelResponseDTO> substituiveis =
                patologiaItemService.listarProdutosSubstituiveisPorPatologia(patologiaId, id);
        return ResponseEntity.ok(substituiveis);
    }
}
