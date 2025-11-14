package br.pucgo.ads.projetointegrador.listaCompras.service;


import br.pucgo.ads.projetointegrador.listaCompras.dto.ProdutoRequestDTO;
import br.pucgo.ads.projetointegrador.listaCompras.dto.ProdutoResponseDTO;
import br.pucgo.ads.projetointegrador.listaCompras.entity.Categoria;
import br.pucgo.ads.projetointegrador.listaCompras.entity.Produto;
import br.pucgo.ads.projetointegrador.listaCompras.repository.CategoriaRepository;
import br.pucgo.ads.projetointegrador.listaCompras.repository.ProdutoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProdutoService {

    private final ProdutoRepository produtoRepository;
    private final CategoriaRepository categoriaRepository;
    private final CategoriaService categoriaService;

    @Transactional
    public ProdutoResponseDTO criarProduto(ProdutoRequestDTO dto){
        //verifica se o produto já existe
        produtoRepository.findByNomeIgnoreCase(dto.getNome()).ifPresent(p -> {
            throw new IllegalArgumentException("Produto já existente");
        });

        Categoria categoria = categoriaRepository.findById(dto.getCategoriaId()).orElseThrow(() -> new IllegalArgumentException("Categoria não encontrada"));

        Produto produto = toEntity(dto, categoria);
        Produto produtoSalvo = produtoRepository.save(produto);
        return toResponseDTO(produtoSalvo);
    }

    @Transactional
    public ProdutoResponseDTO buscarPorId(Long id){
        //verifica se o produto existe
        Produto produto = produtoRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Produto não encontrado"));
        return toResponseDTO(produto);
    }

    @Transactional(readOnly = true)
    public List<ProdutoResponseDTO> listarTodos() {
        //não precisa de verificação por que ja lista todos os produtos disponíveis
        return produtoRepository.findAll().stream().map(this::toResponseDTO).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ProdutoResponseDTO> listarPorCategoriaId(Long categoriaId){
        //verifica se a categoria existe
        if (!categoriaRepository.existsById(categoriaId)) {
            throw new IllegalArgumentException("Categoria não encontrada");
        }
        return produtoRepository.findByCategoria_Id(categoriaId).stream().map(this::toResponseDTO).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ProdutoResponseDTO> buscarPorNome(String nome) {
        return produtoRepository.findByNomeContainingIgnoreCase(nome).stream().map(this::toResponseDTO).collect(Collectors.toList());
    }

    @Transactional
    public ProdutoResponseDTO atualizarProduto(Long id, ProdutoRequestDTO dto){
        Produto produto = produtoRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Produto não encontrado"));
        //verifica se novo nome já existe em outro produto
        if (!produto.getNome().equalsIgnoreCase(dto.getNome())) {
            produtoRepository.findByNomeIgnoreCase(dto.getNome()).ifPresent(p -> {
                throw new IllegalArgumentException("Produto já existente");
            });
        }
        //verifica se a categoria ja existe
        Categoria categoria = categoriaRepository.findById(dto.getCategoriaId()).orElseThrow(() -> new IllegalArgumentException("Categoria não encontrada"));

        produto.setCategoria(categoria);
        produto.setNome(dto.getNome());
        produto.setDescricao(dto.getDescricao());
        produto.setUnidadeMedida(dto.getUnidadeMedida());
        Produto produtoAtualizado =  produtoRepository.save(produto);
        return toResponseDTO(produtoAtualizado);
    }

    @Transactional
    public void deletar(Long id) {
        if (!produtoRepository.existsById(id)) {
            throw new IllegalArgumentException(
                    "Produto não encontrado");
        }
        produtoRepository.deleteById(id);
    }

    private Produto toEntity(ProdutoRequestDTO dto, Categoria categoria){
        Produto produto = new Produto();
        produto.setNome(dto.getNome());
        produto.setDescricao(dto.getDescricao());
        produto.setUnidadeMedida(dto.getUnidadeMedida());
        produto.setCategoria(categoria);
        return produto;
    }

    private ProdutoResponseDTO toResponseDTO(Produto produto){
        return new ProdutoResponseDTO(
                produto.getId(),
                produto.getNome(),
                produto.getDescricao(),
                produto.getUnidadeMedida(),
                categoriaService.buscarPorId(produto.getCategoria().getId()),
                produto.getCreatedAt(),
                produto.getUpdatedAt()
        );
    }
}
