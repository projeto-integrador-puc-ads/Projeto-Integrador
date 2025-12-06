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
        // 1. Busca Patologia e Produto Obrigatórios
        Patologia patologia = patologiaRepository.findById(dto.getPatologiaId())
                .orElseThrow(() -> new IllegalArgumentException("Patologia não encontrada"));

        Produto produto = produtoRepository.findById(dto.getProdutoId())
                .orElseThrow(() -> new IllegalArgumentException("Produto não encontrado"));

        // 2. LÓGICA NOVA: Busca o Produto Sugestão (se o ID veio no DTO)
        Produto produtoSugestao = null;
        if (dto.getProdutoSugestaoId() != null) {
            produtoSugestao = produtoRepository.findById(dto.getProdutoSugestaoId())
                    .orElseThrow(() -> new IllegalArgumentException("Produto sugestão não encontrado"));
        }

        // 3. Validação de duplicidade
        if (patologiaItemRepository.existsByPatologiaIdAndProdutoId(dto.getPatologiaId(), dto.getProdutoId())) {
            throw new IllegalArgumentException("Este produto já está vinculado a esta patologia");
        }

        // 4. Cria a entidade passando a sugestão (mesmo que seja null)
        PatologiaItem patologiaItem = toEntity(dto, patologia, produto, produtoSugestao);

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

    // Método atualizado para receber a sugestão
    private PatologiaItem toEntity(PatologiaItemRequestDTO dto, Patologia patologia, Produto produto, Produto produtoSugestao){
        PatologiaItem patologiaItem = new PatologiaItem();
        patologiaItem.setPatologia(patologia);
        patologiaItem.setProduto(produto);
        patologiaItem.setProdutoSugestao(produtoSugestao); // <--- O PULO DO GATO ESTÁ AQUI
        return patologiaItem;
    }

    private PatologiaItemResponseDTO toResponseDTO(PatologiaItem patologiaItem){
        return new PatologiaItemResponseDTO(
                patologiaItem.getId(),
                patologiaService.buscarPorId(patologiaItem.getPatologia().getId()),
                produtoService.buscarPorId(patologiaItem.getProduto().getId()),
                patologiaItem.getProdutoSugestao() != null
                        ? produtoService.buscarPorId(patologiaItem.getProdutoSugestao().getId())
                        : null,  // ← Converte para DTO ou retorna null
                patologiaItem.getCreatedAt(),
                patologiaItem.getUpdatedAt()
        );
    }

    private ProdutoSubstituivelResponseDTO toSubstituivelResponseDTO(PatologiaItem patologiaItem){
        return new ProdutoSubstituivelResponseDTO(
                patologiaItem.getProduto().getId(),              // produtoAlertadoId
                patologiaItem.getProduto().getNome(),         // produtoAlertadoNome
                patologiaService.buscarPorId(patologiaItem.getPatologia().getId()), // PatologiaResponseDTO
                patologiaItem.getProdutoSugestao() != null
                        ? produtoService.buscarPorId(patologiaItem.getProdutoSugestao().getId())
                        : null  // ProdutoResponseDTO ou null
        );
    }

    @Transactional(readOnly = true)
    public List<ProdutoSubstituivelResponseDTO> listarProdutosSubstituiveisPorPatologia(
            Long patologiaId,
            Long produtoId
    ) {
        return patologiaItemRepository
                .findProdutosSubstituiveisPorPatologia(patologiaId, produtoId).stream()
                .map(this::toSubstituivelResponseDTO)
                .collect(Collectors.toList());
    }
}
