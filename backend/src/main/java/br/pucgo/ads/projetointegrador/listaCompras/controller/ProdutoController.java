package br.pucgo.ads.projetointegrador.listaCompras.controller;


import br.pucgo.ads.projetointegrador.listaCompras.dto.ProdutoRelacionadoResponseDTO;
import br.pucgo.ads.projetointegrador.listaCompras.dto.ProdutoResponseDTO;
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
     * GET /api/produtos/buscar?param=leite
     * autocomplete
     * Retorna no máximo 5 correspondências
     *
     * @param param Texto de busca
     * @return Lista de até 5 produtos que contenham o texto no nome
     */
    @GetMapping("/buscar")
    public ResponseEntity<List<ProdutoResponseDTO>> buscarProdutos(@RequestParam String param) {
        List<ProdutoResponseDTO> produtos = produtoService.buscarPorNome(param);
        return ResponseEntity.ok(produtos);
    }
}
