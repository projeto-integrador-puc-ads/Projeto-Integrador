package br.pucgo.ads.projetointegrador.listaCompras.service;


import br.pucgo.ads.projetointegrador.listaCompras.dto.PatologiaItemRequestDTO;
import br.pucgo.ads.projetointegrador.listaCompras.dto.PatologiaItemResponseDTO;
import br.pucgo.ads.projetointegrador.listaCompras.dto.ProdutoSubstituivelResponseDTO;
import br.pucgo.ads.projetointegrador.listaCompras.entity.Patologia;
import br.pucgo.ads.projetointegrador.listaCompras.entity.PatologiaItem;
import br.pucgo.ads.projetointegrador.listaCompras.entity.Produto;
import br.pucgo.ads.projetointegrador.listaCompras.repository.PatologiaItemRepository;
import br.pucgo.ads.projetointegrador.listaCompras.repository.PatologiaRepository;
import br.pucgo.ads.projetointegrador.listaCompras.repository.ProdutoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PatologiaItemService {

    private final PatologiaItemRepository patologiaItemRepository;
    private final PatologiaRepository patologiaRepository;
    private final ProdutoRepository produtoRepository;
    private final ProdutoService produtoService;
    private final PatologiaService patologiaService;


    @Transactional
    public PatologiaItemResponseDTO vincular(PatologiaItemRequestDTO dto) {
        // Validação: verificar se patologia existe
        Patologia patologia = patologiaRepository.findById(dto.getPatologiaId())
                .orElseThrow(() -> new IllegalArgumentException(
                        "Patologia não encontrada com ID: " + dto.getPatologiaId()));

        // Validação: verificar se produto existe
        Produto produto = produtoRepository.findById(dto.getProdutoId())
                .orElseThrow(() -> new IllegalArgumentException(
                        "Produto não encontrado com ID: " + dto.getProdutoId()));

        // Validação: verificar se já existe o vínculo
        if (patologiaItemRepository.existsByPatologiaIdAndProdutoId(
                dto.getPatologiaId(), dto.getProdutoId())) {
            throw new IllegalArgumentException(
                    "Este produto já está vinculado a esta patologia");
        }

        PatologiaItem patologiaItem = toEntity(dto, patologia, produto);
        PatologiaItem vinculoSalvo = patologiaItemRepository.save(patologiaItem);
        return toResponseDTO(vinculoSalvo);
    }

    @Transactional(readOnly = true)
    public List<ProdutoSubstituivelResponseDTO> listarProdutosSubstituiveis(Long usuarioId, Long produtoId) {
        // Retorna produtos que podem substituir o produto alertado
        // Baseado nas patologias do usuário
        return patologiaItemRepository
                .findProdutosSubstituiveis(usuarioId, produtoId).stream()
                .map(this::toSubstituivelResponseDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public PatologiaItemResponseDTO buscarPorId(Long id) {
        PatologiaItem patologiaItem = patologiaItemRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Vínculo não encontrado com ID: " + id));
        return toResponseDTO(patologiaItem);
    }

    @Transactional(readOnly = true)
    public List<PatologiaItemResponseDTO> listarPorPatologia(Long patologiaId) {
        // Validação: verificar se patologia existe
        if (!patologiaRepository.existsById(patologiaId)) {
            throw new IllegalArgumentException(
                    "Patologia não encontrada com ID: " + patologiaId);
        }
        return patologiaItemRepository.findByPatologiaId(patologiaId).stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<PatologiaItemResponseDTO> listarPorProduto(Long produtoId) {
        // Validação: verificar se produto existe
        if (!produtoRepository.existsById(produtoId)) {
            throw new IllegalArgumentException(
                    "Produto não encontrado com ID: " + produtoId);
        }
        return patologiaItemRepository.findByProdutoId(produtoId).stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public boolean verificarAlerta(Long usuarioId, Long produtoId) {
        // Método IMPORTANTE: verifica se o produto deve ser alertado para o usuário
        return patologiaItemRepository.produtoDeveSerAlertado(usuarioId, produtoId);
    }

    public void desvincular(Long id) {
        if (!patologiaItemRepository.existsById(id)) {
            throw new IllegalArgumentException(
                    "Vínculo não encontrado com ID: " + id);
        }
        patologiaItemRepository.deleteById(id);
    }

    private PatologiaItem toEntity(PatologiaItemRequestDTO dto, Patologia patologia, Produto produto){
        PatologiaItem patologiaItem = new PatologiaItem();
        patologiaItem.setPatologia(patologia);
        patologiaItem.setProduto(produto);
        return patologiaItem;
    }

    private PatologiaItemResponseDTO toResponseDTO(PatologiaItem patologiaItem){
        return new PatologiaItemResponseDTO(
                patologiaItem.getId(),
                patologiaService.findById(patologiaItem.getPatologia().getId()),
                produtoService.buscarPorId(patologiaItem.getProduto().getId()),
                patologiaItem.getProdutoSugestao(),
                patologiaItem.getCreatedAt(),
                patologiaItem.getUpdatedAt()
        );
    }

    private ProdutoSubstituivelResponseDTO toSubstituivelResponseDTO(PatologiaItem produtoSubstituivel){
        return new ProdutoSubstituivelResponseDTO(
                produtoSubstituivel.getProdutoSugestao(),
                produtoSubstituivel.getPatologia(),
                produtoSubstituivel.getId()
        );
    }
}
