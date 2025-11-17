package br.pucgo.ads.projetointegrador.listaCompras.service;

import br.pucgo.ads.projetointegrador.listaCompras.dto.ItemListaRequestDTO;
import br.pucgo.ads.projetointegrador.listaCompras.dto.ItemListaResponseDTO;
import br.pucgo.ads.projetointegrador.listaCompras.entity.ItemLista;
import br.pucgo.ads.projetointegrador.listaCompras.entity.ItemListaId;
import br.pucgo.ads.projetointegrador.listaCompras.entity.Lista;
import br.pucgo.ads.projetointegrador.listaCompras.entity.Produto;
import br.pucgo.ads.projetointegrador.listaCompras.repository.ItemListaRepository;
import br.pucgo.ads.projetointegrador.listaCompras.repository.ListaRepository;
import br.pucgo.ads.projetointegrador.listaCompras.repository.ProdutoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ItemListaService {

    private final ItemListaRepository itemListaRepository;
    private final ListaRepository listaRepository;
    private final ProdutoRepository produtoRepository;
    private final ProdutoService produtoService;
    //private final PatologiaItemService patologiaItemService;

    @Transactional
    public ItemListaResponseDTO adicionarItem(ItemListaRequestDTO dto) {
        //verificar se lista existe
        Lista lista = listaRepository.findById(dto.getListaId())
                .orElseThrow(() -> new IllegalArgumentException(
                        "Lista não encontrada com ID: " + dto.getListaId()));

        // não permitir adicionar item em lista finalizada
        if (lista.getStatus() == Lista.StatusLista.FINALIZADA) {
            throw new IllegalArgumentException(
                    "Não é possível adicionar itens em uma lista finalizada");
        }

        // verificar se produto existe
        Produto produto = produtoRepository.findById(dto.getProdutoId())
                .orElseThrow(() -> new IllegalArgumentException(
                        "Produto não encontrado com ID: " + dto.getProdutoId()));

        // verificar se produto já está na lista
        if (itemListaRepository.existsById_ListaIdAndId_ProdutoId(
                dto.getListaId(), dto.getProdutoId())) {
            throw new IllegalArgumentException(
                    "Este produto já está na lista. Use atualizar para modificar a quantidade.");
        }

        ItemLista itemLista = toEntity(dto, lista, produto);
        ItemLista itemSalvo = itemListaRepository.save(itemLista);

        return toResponseDTO(itemSalvo);
    }

    @Transactional(readOnly = true)
    public ItemListaResponseDTO buscarPorId(Long listaId, Long produtoId) {
        ItemLista itemLista = itemListaRepository.findById_ListaIdAndId_ProdutoId(listaId, produtoId)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Item não encontrado na lista"));
        return toResponseDTO(itemLista);
    }

    @Transactional(readOnly = true)
    public List<ItemListaResponseDTO> listarPorLista(Long listaId) {
        // verificar se lista existe
        if (!listaRepository.existsById(listaId)) {
            throw new IllegalArgumentException(
                    "Lista não encontrada com ID: " + listaId);
        }
        return itemListaRepository.findById_ListaId(listaId).stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public ItemListaResponseDTO atualizarQuantidade(Long listaId, Long produtoId, BigDecimal novaQuantidade) {
        ItemLista itemLista = itemListaRepository.findById_ListaIdAndId_ProdutoId(listaId, produtoId)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Item não encontrado na lista"));

        // não permitir atualizar item em lista finalizada
        if (itemLista.getLista().getStatus() == Lista.StatusLista.FINALIZADA) {
            throw new IllegalArgumentException(
                    "Não é possível atualizar itens de uma lista finalizada");
        }

        // quantidade deve ser positiva
        if (novaQuantidade.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException(
                    "A quantidade deve ser maior que zero");
        }

        itemLista.setQuantidade(novaQuantidade);
        ItemLista itemAtualizado = itemListaRepository.save(itemLista);

        return toResponseDTO(itemAtualizado);
    }

    @Transactional
    public void removerItem(Long listaId, Long produtoId) {
        //  verificar se item existe
        ItemLista itemLista = itemListaRepository.findById_ListaIdAndId_ProdutoId(listaId, produtoId)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Item não encontrado na lista"));

        // não permitir remover item de lista finalizada
        if (itemLista.getLista().getStatus() == Lista.StatusLista.FINALIZADA) {
            throw new IllegalArgumentException(
                    "Não é possível remover itens de uma lista finalizada");
        }

        itemListaRepository.deleteById_ListaIdAndId_ProdutoId(listaId, produtoId);
    }

    //@Transactional(readOnly = true)
    //public boolean verificarAlerta(Long userId, Long produtoId) {
        // Verifica se o produto deve ser alertado para o usuário
        // devido às suas patologias
        //return patologiaItemService.verificarAlerta(userId, produtoId);
    //}

    // Método público para ser usado por outros services
    public ItemListaResponseDTO toResponseDTO(ItemLista itemLista) {
        // Verificar se deve alertar o usuário sobre o produto
       // boolean deveAlertar = patologiaItemService.verificarAlerta(
         //       itemLista.getLista().getUsuario().getId(),
           //     itemLista.getProduto().getId()
        //);

        return new ItemListaResponseDTO(
                itemLista.getId().getListaId(),
                itemLista.getId().getProdutoId(),
                produtoService.buscarPorId(itemLista.getProduto().getId()),
                itemLista.getQuantidade(),
                itemLista.getComprado(),
                itemLista.getCreatedAt()
        );
    }

    // Métodos auxiliares de conversão
    private ItemLista toEntity(ItemListaRequestDTO dto, Lista lista, Produto produto) {
        ItemListaId id = new ItemListaId(dto.getListaId(), dto.getProdutoId());

        ItemLista itemLista = new ItemLista();
        itemLista.setId(id);
        itemLista.setLista(lista);
        itemLista.setProduto(produto);
        itemLista.setQuantidade(dto.getQuantidade() != null ? dto.getQuantidade() : BigDecimal.ONE);

        return itemLista;
    }
}
