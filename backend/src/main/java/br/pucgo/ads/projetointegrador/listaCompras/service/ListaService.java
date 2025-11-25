package br.pucgo.ads.projetointegrador.listaCompras.service;

import br.pucgo.ads.projetointegrador.listaCompras.dto.*;
import br.pucgo.ads.projetointegrador.listaCompras.entity.ItemLista;
import br.pucgo.ads.projetointegrador.listaCompras.entity.ItemListaId;
import br.pucgo.ads.projetointegrador.listaCompras.entity.Lista;
import br.pucgo.ads.projetointegrador.listaCompras.entity.Produto;
import br.pucgo.ads.projetointegrador.listaCompras.repository.ItemListaRepository;
import br.pucgo.ads.projetointegrador.listaCompras.repository.ListaRepository;
import br.pucgo.ads.projetointegrador.listaCompras.repository.ProdutoRepository;
import br.pucgo.ads.projetointegrador.plataforma.entity.User;
import br.pucgo.ads.projetointegrador.plataforma.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ListaService {

    private final ListaRepository listaRepository;
    private final UserRepository userRepository;
    private final ItemListaRepository itemListaRepository;
    private final ItemListaService itemListaService;
    private final ProdutoRepository produtoRepository;

    /**
     * Cria uma lista já com seus itens (usada pelo front da lista de compras).
     *
     * @param userId ID do usuário dono da lista
     * @param dto    payload com título e itens (produtoId + qtd)
     */
    @Transactional
    public ListaResponseDTO criarComItens(Long userId, ListaCreateRequestDTO dto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Usuário não encontrado com ID: " + userId));

        if (listaRepository.existsByUsuario_IdAndTituloIgnoreCase(userId, dto.getTitulo())) {
            throw new IllegalArgumentException(
                    "Já existe uma lista com o título: " + dto.getTitulo());
        }

        Lista lista = new Lista();
        lista.setTitulo(dto.getTitulo());
        lista.setUsuario(user);
        lista.setTemplate(false);

        Lista listaSalva = listaRepository.save(lista);

        // 4) Criar itens da lista
        if (dto.getItens() != null) {
            for (ListaItemCreateDTO itemDTO : dto.getItens()) {

                Produto produto = produtoRepository.findById(itemDTO.getProdutoId())
                        .orElseThrow(() -> new IllegalArgumentException(
                                "Produto não encontrado com ID: " + itemDTO.getProdutoId()));

                ItemListaId id = new ItemListaId(listaSalva.getId(), produto.getId());

                ItemLista item = new ItemLista();
                item.setId(id);
                item.setLista(listaSalva);
                item.setProduto(produto);
                item.setQuantidade(
                        itemDTO.getQtd() != null
                                ? BigDecimal.valueOf(itemDTO.getQtd())
                                : BigDecimal.ONE
                );

                itemListaRepository.save(item);
            }
        }

        return toResponseDTO(listaSalva);
    }

    @Transactional(readOnly = true)
    public ListaResponseDTO buscarPorId(Long id) {
        Lista lista = listaRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Lista não encontrada com ID: " + id));
        return toResponseDTO(lista);
    }


    @Transactional(readOnly = true)
    public List<ListaResponseDTO> listarListasNormais(Long userId) {
        // Lista apenas listas normais (não-template) do usuário
        if (!userRepository.existsById(userId)) {
            throw new IllegalArgumentException(
                    "Usuário não encontrado com ID: " + userId);
        }
        return listaRepository.findByUsuario_IdAndTemplateFalse(userId).stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ListaResponseDTO> listarPorUsuarioEStatus(Long userId, Lista.StatusLista status) {
        // Lista listas do usuário com status específico
        if (!userRepository.existsById(userId)) {
            throw new IllegalArgumentException(
                    "Usuário não encontrado com ID: " + userId);
        }
        return listaRepository.findByUsuario_IdAndStatusOrderByCreatedAtDesc(userId, status).stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ListaResponseDTO> listarAbertasPorUsuario(Long userId) {
        return listarPorUsuarioEStatus(userId, Lista.StatusLista.ABERTA);
    }

    @Transactional(readOnly = true)
    public List<ListaResponseDTO> listarFinalizadasPorUsuario(Long userId) {
        return listarPorUsuarioEStatus(userId, Lista.StatusLista.FINALIZADA);
    }

    @Transactional(readOnly = true)
    public List<ListaResponseDTO> listarTemplates() {
        // Lista todos os templates disponíveis
        return listaRepository.findByTemplateTrueOrderByTituloAsc().stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public ListaResponseDTO atualizar(Long id, ListaRequestDTO dto) {
        Lista lista = listaRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Lista não encontrada com ID: " + id));

        // Validação: não permitir atualizar templates
        if (lista.getTemplate()) {
            throw new IllegalArgumentException(
                    "Não é possível atualizar uma lista template");
        }

        // Validação: não permitir atualizar lista finalizada
        if (lista.getStatus() == Lista.StatusLista.FINALIZADA) {
            throw new IllegalArgumentException(
                    "Não é possível atualizar uma lista finalizada");
        }

        // Validação: verificar se novo título já existe
        if (!lista.getTitulo().equalsIgnoreCase(dto.getTitulo())) {
            if (listaRepository.existsByUsuario_IdAndTituloIgnoreCase(
                    lista.getUsuario().getId(), dto.getTitulo())) {
                throw new IllegalArgumentException(
                        "Já existe outra lista com o título: " + dto.getTitulo());
            }
        }

        lista.setTitulo(dto.getTitulo());

        Lista listaAtualizada = listaRepository.save(lista);
        return toResponseDTO(listaAtualizada);
    }

    @Transactional
    public ListaResponseDTO finalizarLista(Long id) {
        Lista lista = listaRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Lista não encontrada com ID: " + id));

        // Validação: não permitir finalizar templates
        if (lista.getTemplate()) {
            throw new IllegalArgumentException(
                    "Não é possível finalizar uma lista template");
        }

        // Validação: verificar se já está finalizada
        if (lista.getStatus() == Lista.StatusLista.FINALIZADA) {
            throw new IllegalArgumentException(
                    "Esta lista já está finalizada");
        }

        // Finalizar a lista
        lista.setStatus(Lista.StatusLista.FINALIZADA);

        Lista listaFinalizada = listaRepository.save(lista);

        // TODO: Chamar o sistema de recomendação quando implementado
        // recomendacaoService.processarListaFinalizada(listaFinalizada);

        return toResponseDTO(listaFinalizada);
    }

    @Transactional
    public ListaResponseDTO clonarTemplate(Long templateId, Long userId) {
        // Buscar template
        Lista template = listaRepository.findById(templateId)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Template não encontrado com ID: " + templateId));

        if (!template.getTemplate()) {
            throw new IllegalArgumentException(
                    "Esta lista não é um template");
        }

        // Buscar usuário
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Usuário não encontrado com ID: " + userId));

        // Criar nova lista baseada no template
        Lista novaLista = new Lista();
        novaLista.setTitulo(template.getTitulo() + " (cópia)");
        novaLista.setUsuario(user);
        novaLista.setTemplate(false);

        Lista listaSalva = listaRepository.save(novaLista);

        List<ItemLista> itensTemplate = itemListaRepository.findById_ListaId(templateId);

        for (ItemLista itemTemplate : itensTemplate) {
            ItemListaId novoId = new ItemListaId(listaSalva.getId(), itemTemplate.getProduto().getId());

            ItemLista novoItem = new ItemLista();
            novoItem.setId(novoId);
            novoItem.setLista(listaSalva);
            novoItem.setProduto(itemTemplate.getProduto());
            novoItem.setQuantidade(itemTemplate.getQuantidade());

            itemListaRepository.save(novoItem);
        }

        return toResponseDTO(listaSalva);
    }

    @Transactional
    public void deletar(Long id) {
        Lista lista = listaRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Lista não encontrada com ID: " + id));

        // Validação: não permitir deletar templates
        if (lista.getTemplate()) {
            throw new IllegalArgumentException(
                    "Não é possível deletar uma lista template");
        }

        listaRepository.deleteById(id);
    }

    // Métodos auxiliares de conversão
    private Lista toEntity(ListaRequestDTO dto, User user) {
        Lista lista = new Lista();
        lista.setTitulo(dto.getTitulo());
        lista.setUsuario(user);
        lista.setTemplate(dto.getTemplate() != null ? dto.getTemplate() : false);
        return lista;
    }

    private ListaResponseDTO toResponseDTO(Lista lista) {

        List<ItemListaResponseDTO> itens = itemListaRepository
                .findById_ListaId(lista.getId()).stream()
                .map(itemListaService::toResponseDTO) // ← Usa o service público
                .collect(Collectors.toList());

        return new ListaResponseDTO(
                lista.getId(),
                lista.getTitulo(),
                lista.getUsuario().getId(),
                lista.getUsuario().getName(),
                lista.getTemplate(),
                lista.getCreatedAt(),
                null, // descricao (transient)
                lista.getStatus() != null ? lista.getStatus().name() : null, // status
                new ArrayList<>() // itens (será preenchido depois)
        );
    }
}
