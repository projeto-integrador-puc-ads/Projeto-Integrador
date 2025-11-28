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

import java.text.Normalizer;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProdutoService {

    private final ProdutoRepository produtoRepository;
    private final CategoriaRepository categoriaRepository;
    private final CategoriaService categoriaService;

    @Transactional
    public ProdutoResponseDTO criar(ProdutoRequestDTO dto) {
        //verificar se já existe produto com mesmo nome
        produtoRepository.findByNomeIgnoreCase(dto.getNome())
                .ifPresent(p -> {
                    throw new IllegalArgumentException(
                            "Já existe um produto com o nome: " + dto.getNome());
                });

        //verificar se a categoria existe
        Categoria categoria = categoriaRepository.findById(dto.getCategoriaId())
                .orElseThrow(() -> new IllegalArgumentException(
                        "Categoria não encontrada com ID: " + dto.getCategoriaId()));

        Produto produto = toEntity(dto, categoria);
        Produto produtoSalvo = produtoRepository.save(produto);
        return toResponseDTO(produtoSalvo);
    }

    @Transactional(readOnly = true)
    public ProdutoResponseDTO buscarPorId(Long id) {
        Produto produto = produtoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Produto não encontrado com ID: " + id));
        return toResponseDTO(produto);
    }

    @Transactional(readOnly = true)
    public List<ProdutoResponseDTO> listarTodos() {
        return produtoRepository.findAll().stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ProdutoResponseDTO> listarAtivos() {
        return produtoRepository.findByAtivoTrue().stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ProdutoResponseDTO> listarPorCategoria(Long categoriaId) {
        //verificar se categoria existe
        if (!categoriaRepository.existsById(categoriaId)) {
            throw new IllegalArgumentException(
                    "Categoria não encontrada com ID: " + categoriaId);
        }
        return produtoRepository.findByCategoriaIdAndAtivoTrue(categoriaId).stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ProdutoResponseDTO> buscarPorNome(String nome) {
        return produtoRepository.findByNomeNormalizado(nome.toLowerCase().trim()).stream().map(this::toResponseDTO).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ProdutoResponseDTO> buscarPorTag(String tag) {
        return produtoRepository.findByTagsContainingIgnoreCaseAndAtivoTrue(tag).stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public ProdutoResponseDTO atualizar(Long id, ProdutoRequestDTO dto) {
        Produto produto = produtoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Produto não encontrado com ID: " + id));

        //verificar se novo nome já existe em outro produto
        if (!produto.getNome().equalsIgnoreCase(dto.getNome())) {
            produtoRepository.findByNomeIgnoreCase(dto.getNome())
                    .ifPresent(p -> {
                        throw new IllegalArgumentException(
                                "Já existe outro produto com o nome: " + dto.getNome());
                    });
        }

        // verificar se a nova categoria existe
        Categoria categoria = categoriaRepository.findById(dto.getCategoriaId())
                .orElseThrow(() -> new IllegalArgumentException(
                        "Categoria não encontrada com ID: " + dto.getCategoriaId()));

        produto.setNome(dto.getNome());
        produto.setNomeNormalizado(normalizarNome(dto.getNome()));
        produto.setPreco(dto.getPreco());
        produto.setTags(dto.getTags());
        produto.setAtivo(dto.getAtivo());
        produto.setIsPersonalizado(dto.getIsPersonalizado());
        produto.setCategoria(categoria);

        Produto produtoAtualizado = produtoRepository.save(produto);
        return toResponseDTO(produtoAtualizado);
    }

    @Transactional
    public void deletar(Long id) {
        Produto produto = produtoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Produto não encontrado com ID: " + id));

        // Soft delete - apenas desativa
        produto.setAtivo(false);
        produtoRepository.save(produto);
    }

    @Transactional
    public void deletarPermanente(Long id) {
        if (!produtoRepository.existsById(id)) {
            throw new IllegalArgumentException(
                    "Produto não encontrado com ID: " + id);
        }
        produtoRepository.deleteById(id);
    }

    // Métodos que ajuda na conversão
    private Produto toEntity(ProdutoRequestDTO dto, Categoria categoria) {
        Produto produto = new Produto();
        produto.setNome(dto.getNome());
        produto.setNomeNormalizado(normalizarNome(dto.getNome()));
        produto.setPreco(dto.getPreco());
        produto.setTags(dto.getTags());
        produto.setAtivo(dto.getAtivo() != null ? dto.getAtivo() : true);
        produto.setIsPersonalizado(dto.getIsPersonalizado() != null ? dto.getIsPersonalizado() : false);
        produto.setCategoria(categoria);
        return produto;
    }

    private ProdutoResponseDTO toResponseDTO(Produto produto) {
        return new ProdutoResponseDTO(
                produto.getId(),
                produto.getNome(),
                produto.getNomeNormalizado(),
                produto.getPreco(),
                produto.getAtivo(),
                produto.getIsPersonalizado(),
                produto.getTags(),
                categoriaService.buscarPorId(produto.getCategoria().getId()),
                produto.getCreatedAt(),
                produto.getUpdatedAt(),
                null, // descricao (transient)
                null  // unidadeMedida (transient)
        );
    }

    private String normalizarNome(String nome) {
        if (nome == null) return null;

        // Remove acentos e converte para minúsculo
        String normalizado;
        normalizado = Normalizer.normalize(nome, Normalizer.Form.NFD)
                .replaceAll("[\\p{InCombiningDiacriticalMarks}]", "")
                .toLowerCase()
                .trim();

        return normalizado;
    }
}