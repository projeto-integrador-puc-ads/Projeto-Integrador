package br.pucgo.ads.projetointegrador.listaCompras.service;

import br.pucgo.ads.projetointegrador.listaCompras.dto.*;
import br.pucgo.ads.projetointegrador.listaCompras.entity.ItemLista;
import br.pucgo.ads.projetointegrador.listaCompras.entity.ItemListaId;
import br.pucgo.ads.projetointegrador.listaCompras.entity.Lista;
import br.pucgo.ads.projetointegrador.listaCompras.entity.Produto;
import br.pucgo.ads.projetointegrador.listaCompras.repository.ItemListaRepository;
import br.pucgo.ads.projetointegrador.listaCompras.repository.ListaRepository;
import br.pucgo.ads.projetointegrador.listaCompras.repository.ProdutoRepository;
import br.pucgo.ads.projetointegrador.listaCompras.repository.UsuarioPatologiaRepository;
import br.pucgo.ads.projetointegrador.plataforma.entity.User;
import br.pucgo.ads.projetointegrador.plataforma.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import br.pucgo.ads.projetointegrador.listaCompras.entity.Patologia;
import br.pucgo.ads.projetointegrador.listaCompras.repository.PatologiaRepository;

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
    private final UsuarioPatologiaRepository usuarioPatologiaRepository;
    private final PatologiaRepository patologiaRepository;

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

        boolean isTemplate = Boolean.TRUE.equals(dto.getIsTemplate());
        if (!isTemplate) {
            if (dto.getItens() == null || dto.getItens().isEmpty()) {
                throw new IllegalArgumentException("A lista deve possuir ao menos um item");
            }
        }

        Lista lista = new Lista();
        lista.setTitulo(dto.getTitulo());
        lista.setUsuario(user);
        lista.setTemplate(isTemplate);

        if (dto.getPatologiaId() != null) {
            Patologia patologia = patologiaRepository.findById(dto.getPatologiaId())
                    .orElseThrow(() -> new IllegalArgumentException("Patologia não encontrada com ID: " + dto.getPatologiaId()));
            lista.setPatologia(patologia);
        }

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
        return listaRepository.findByUsuario_IdAndTemplateFalseOrderByCreatedAtDesc(userId).stream()
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
    public List<ListaResponseDTO> listarTemplates(Long userId) {

        List<Long> patologiaIds = usuarioPatologiaRepository
                .findPatologiaIdsByUsuarioId(userId);

        List<Lista> listas;

        if (patologiaIds == null || patologiaIds.isEmpty()) {

            listas = listaRepository
                    .findByTemplateTrueAndPatologiaIsNullOrderByTituloAsc();

        } else {
            listas = listaRepository
                    .buscarTemplatesPorPatologiasOuGenericos(patologiaIds);
        }

        // 3) Converte para DTO
        return listas.stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());

    }



    @Transactional
    public ListaResponseDTO finalizarLista(Long id) {
        Lista lista = listaRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Lista não encontrada com ID: " + id));


        // Validação: verificar se já está finalizada
        if (lista.getStatus() == Lista.StatusLista.FINALIZADA) {
            throw new IllegalArgumentException(
                    "Esta lista já está finalizada");
        }

        // Finalizar a lista
        lista.setStatus(Lista.StatusLista.FINALIZADA);

        Lista listaFinalizada = listaRepository.save(lista);

        return toResponseDTO(listaFinalizada);
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
                .findById_ListaId(lista.getId())
                .stream()
                .map(itemListaService::toResponseDTO)
                .collect(Collectors.toList());

        Long patologiaId = lista.getPatologia() != null
                ? lista.getPatologia().getId()
                : null;

        return new ListaResponseDTO(
                lista.getId(),
                lista.getTitulo(),
                lista.getUsuario().getId(),
                lista.getUsuario().getName(),
                patologiaId,
                lista.getTemplate(),
                lista.getCreatedAt(),
                lista.getDescricao(),
                lista.getStatus() != null ? lista.getStatus().name() : null,
                itens
        );
    }

    @Transactional
    public ListaResponseDTO atualizarLista(Long id, ListaCreateRequestDTO dto) {
        if (dto == null) {
            throw new IllegalArgumentException("Dados da lista não informados.");
        }
        if (dto.getTitulo() == null || dto.getTitulo().isBlank()) {
            throw new IllegalArgumentException("Título da lista é obrigatório.");
        }

        // 1. Buscar lista existente
        Lista lista = listaRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Lista não encontrada para o id " + id));

        Long usuarioId = lista.getUsuario().getId();

        // 2. Regra opcional: impedir título duplicado para o mesmo usuário
        String novoTitulo = dto.getTitulo().trim();
        if (!novoTitulo.equalsIgnoreCase(lista.getTitulo())
                && listaRepository.existsByUsuario_IdAndTituloIgnoreCase(usuarioId, novoTitulo)) {
            throw new IllegalArgumentException("Já existe uma lista com este título para o usuário.");
        }

        // 3. Atualizar campos simples
        lista.setTitulo(novoTitulo);

        if (dto.getIsTemplate() != null) {
            lista.setTemplate(dto.getIsTemplate());
        }

        // 4. Atualizar patologia (opcional)
        if (dto.getPatologiaId() != null) {
            Patologia patologia = patologiaRepository.findById(dto.getPatologiaId())
                    .orElseThrow(() -> new IllegalArgumentException(
                            "Patologia não encontrada para o id " + dto.getPatologiaId()
                    ));
            lista.setPatologia(patologia);
        } else {
            lista.setPatologia(null);
        }

        // 5. Limpar itens antigos da lista
        List<ItemLista> itensAntigos = itemListaRepository.findById_ListaId(lista.getId());
        if (!itensAntigos.isEmpty()) {
            itemListaRepository.deleteAll(itensAntigos);
        }

        // 6. Recriar itens a partir do DTO
        if (dto.getItens() != null) {
            dto.getItens().forEach(itemDTO -> {
                if (itemDTO.getProdutoId() == null) {
                    throw new IllegalArgumentException("ProdutoId é obrigatório nos itens da lista.");
                }

                // quantidade mínima 1
                if (itemDTO.getQtd() == null || itemDTO.getQtd().doubleValue() <= 0) {
                    throw new IllegalArgumentException("Quantidade deve ser maior que zero.");
                }

                Produto produto = produtoRepository.findById(itemDTO.getProdutoId())
                        .orElseThrow(() -> new IllegalArgumentException(
                                "Produto não encontrado para o id " + itemDTO.getProdutoId()
                        ));

                ItemListaId chave = new ItemListaId();
                chave.setListaId(lista.getId());
                chave.setProdutoId(produto.getId());

                ItemLista item = new ItemLista();
                item.setId(chave);
                item.setLista(lista);
                item.setProduto(produto);

                // se o campo na entidade for BigDecimal
                item.setQuantidade(new BigDecimal(itemDTO.getQtd().toString()));

                itemListaRepository.save(item);
            });
        }

        // 7. Persistir lista (garante flush de alterações simples)
        listaRepository.save(lista);

        // 8. Montar DTO de resposta usando o mesmo mapper que você já tem para criação/listagem
        return toResponseDTO(lista);
    }

    @Transactional
    public ListaResponseDTO reabrirLista(Long id) {
        Lista lista = listaRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Lista não encontrada com ID: " + id));



        // Só faz sentido reabrir se estiver finalizada
        if (lista.getStatus() != Lista.StatusLista.FINALIZADA) {
            throw new IllegalArgumentException(
                    "Só é possível reabrir listas que estejam finalizadas");
        }

        // Considerando que seu enum tem ABERTA / FINALIZADA
        lista.setStatus(Lista.StatusLista.ABERTA);

        Lista listaReaberta = listaRepository.save(lista);
        return toResponseDTO(listaReaberta);
    }


}
