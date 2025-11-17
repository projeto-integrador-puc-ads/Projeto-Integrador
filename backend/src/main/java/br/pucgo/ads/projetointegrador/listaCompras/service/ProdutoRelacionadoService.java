package br.pucgo.ads.projetointegrador.listaCompras.service;


import br.pucgo.ads.projetointegrador.listaCompras.dto.ProdutoRelacionadoResponseDTO;
import br.pucgo.ads.projetointegrador.listaCompras.entity.Produto;
import br.pucgo.ads.projetointegrador.listaCompras.entity.ProdutoRelacionado;
import br.pucgo.ads.projetointegrador.listaCompras.repository.ProdutoRelacionadoRepository;
import br.pucgo.ads.projetointegrador.listaCompras.repository.ProdutoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProdutoRelacionadoService {

    private final ProdutoRelacionadoRepository produtoRelacionadoRepository;
    private final ProdutoRepository produtoRepository;
    private final ProdutoService produtoService;

    @Transactional(readOnly = true)
    public List<ProdutoRelacionadoResponseDTO> listarProdutosRelacionados(Long produtoId) {
        //verifica se produto ja existe
        if (!produtoRepository.existsById(produtoId)) {
            throw new IllegalArgumentException("Produto não encontrado");
        }

        return produtoRelacionadoRepository.findProdutosRelacionados(produtoId).stream().map(this::toResponseDTO).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ProdutoRelacionadoResponseDTO> listarTopProdutosRelacionados(Long produtoId, int limit) {
        // Validação: verificar se produto existe
        if (!produtoRepository.existsById(produtoId)) {
            throw new IllegalArgumentException("Produto não encontrado");
        }

        return produtoRelacionadoRepository.findTopProdutosRelacionados(produtoId, limit).stream().map(this::toResponseDTO).collect(Collectors.toList());
    }

    //método auxiliar de conversão
    private ProdutoRelacionadoResponseDTO toResponseDTO(ProdutoRelacionado produtoRelacionado) {
        return new ProdutoRelacionadoResponseDTO(
                produtoRelacionado.getId().getProdutoId(),
                produtoRelacionado.getId().getSimilarId(),
                produtoService.buscarPorId(produtoRelacionado.getSimilar().getId()),
                produtoRelacionado.getAfinidade(),
                produtoRelacionado.getAtualizadoEm()
        );
    }
}
