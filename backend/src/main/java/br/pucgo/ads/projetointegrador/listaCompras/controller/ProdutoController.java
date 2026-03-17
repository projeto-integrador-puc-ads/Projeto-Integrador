package br.pucgo.ads.projetointegrador.listaCompras.controller;


import br.pucgo.ads.projetointegrador.listaCompras.dto.ProdutoRelacionadoResponseDTO;
import br.pucgo.ads.projetointegrador.listaCompras.dto.ProdutoResponseDTO;
import br.pucgo.ads.projetointegrador.listaCompras.dto.ProdutoSubstituivelResponseDTO;
import br.pucgo.ads.projetointegrador.listaCompras.service.PatologiaItemService;
import br.pucgo.ads.projetointegrador.listaCompras.service.ProdutoRelacionadoService;
import br.pucgo.ads.projetointegrador.listaCompras.service.ProdutoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/lista-compras/produtos")
@RequiredArgsConstructor
public class ProdutoController {

    private final ProdutoService produtoService;
    private final ProdutoRelacionadoService produtoRelacionadoService;
    private final PatologiaItemService patologiaItemService;

    @GetMapping
    public ResponseEntity<List<ProdutoResponseDTO>> listarTodos(){
        List<ProdutoResponseDTO> produtos = produtoService.listarAtivos();
        return ResponseEntity.ok(produtos);
    }

    /**
     * GET /api/produtos/{id}/relacionados
     * Listar produtos relacionados (por afinidade)
     *
     * @param id ID do produto
     * @return Lista de produtos relacionados ordenados por afinidade
     */
    @GetMapping("/{id}/relacionados")
    public ResponseEntity<List<ProdutoRelacionadoResponseDTO>> listarProdutosRelacionados(@PathVariable Long id) {
        List<ProdutoRelacionadoResponseDTO> relacionados = produtoRelacionadoService.listarProdutosRelacionados(id);
        return ResponseEntity.ok(relacionados);
    }

    /**
     * GET /api/produtos/{id}/substituiveis?userId=1
     * Listar produtos que podem substituir o produto alertado
     * Usar quando TEM alerta de patologia
     *
     * @param id ID do produto alertado
     * @param userId ID do usuário (para verificar suas patologias)
     * @return Lista de produtos substitutos sugeridos
     */
    @GetMapping("/{id}/substituiveis")
    public ResponseEntity<List<ProdutoSubstituivelResponseDTO>> listarProdutosSubstituiveis(
            @PathVariable Long id,
            @RequestParam Long userId) {
        List<ProdutoSubstituivelResponseDTO> substituiveis =
                patologiaItemService.listarProdutosSubstituiveis(userId, id);
        return ResponseEntity.ok(substituiveis);
    }

    /**
     * GET /api/produtos/buscar?param=leite
     * autocomplete
     * Retorna no máximo 5 correspondências
     *
     * @param param Texto de busca
     * @return Lista de até 5 produtos que contenham o texto no nome
     */
    @GetMapping("/buscar")
    public ResponseEntity<List<ProdutoResponseDTO>> buscarProdutos(@RequestParam String param) {
        System.out.println("AQUIIIIIII");
        List<ProdutoResponseDTO> produtos = produtoService.buscarPorNome(param);
        return ResponseEntity.ok(produtos);
    }

    @GetMapping("/{id}/substituiveis-por-patologia")
    public ResponseEntity<List<ProdutoSubstituivelResponseDTO>> listarProdutosSubstituiveisPorPatologia(
            @PathVariable Long id,
            @RequestParam Long patologiaId) {

        List<ProdutoSubstituivelResponseDTO> substituiveis =
                patologiaItemService.listarProdutosSubstituiveisPorPatologia(patologiaId, id);
        return ResponseEntity.ok(substituiveis);
    }
}
