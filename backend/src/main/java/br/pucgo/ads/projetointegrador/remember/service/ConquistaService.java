package br.pucgo.ads.projetointegrador.remember.service;

import br.pucgo.ads.projetointegrador.plataforma.Exception.RecursoNaoEncontradoException;
import br.pucgo.ads.projetointegrador.remember.dto.conquista.ConquistaRequestDTO;
import br.pucgo.ads.projetointegrador.remember.dto.conquista.ConquistaResponseDTO;
import br.pucgo.ads.projetointegrador.remember.entity.Conquista;
import br.pucgo.ads.projetointegrador.remember.repository.ConquistaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.nio.file.FileSystems;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ConquistaService {

    private final ConquistaRepository conquistaRepository;
    private static final String SEPARADOR = FileSystems.getDefault().getSeparator();
    private static final String CAMINHO_CONQUISTAS = SEPARADOR + "arquivos" + SEPARADOR + "remember" + SEPARADOR +
            "imagens" + SEPARADOR + "conquistas" + SEPARADOR;

    @Autowired
    public ConquistaService(ConquistaRepository conquistaRepository) {
        this.conquistaRepository = conquistaRepository;
    }

    /**
     * Salva uma nova definição de conquista no sistema.
     * @param requestDTO Os dados da conquista a ser criada.
     * @return Os dados da conquista salva.
     */
    public ConquistaResponseDTO salvarConquista(ConquistaRequestDTO requestDTO) {
        Conquista novaConquista = new Conquista();

        novaConquista.setNome(requestDTO.getNome());
        novaConquista.setDescricao(requestDTO.getDescricao());
        novaConquista.setMeta(requestDTO.getMeta());
        novaConquista.setPontos(requestDTO.getPontos());
        novaConquista.setTipo(requestDTO.getTipo());

        Conquista conquistaSalva = conquistaRepository.save(novaConquista);
        return new ConquistaResponseDTO(conquistaSalva);
    }

    /**
     * Busca uma conquista pelo seu identificador.
     * @param identificador O ID da conquista.
     * @return Os dados da conquista encontrada.
     */
    public ConquistaResponseDTO buscarConquistaPorId(Long identificador) {
        Conquista conquista = conquistaRepository.findById(identificador)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Conquista não encontrada com o ID: " + identificador));
        return new ConquistaResponseDTO(conquista);
    }

    /**
     * Lista todas as conquistas disponíveis no sistema.
     * @return Uma lista com todas as conquistas.
     */
    public List<ConquistaResponseDTO> listarConquistas() {
        return conquistaRepository.findAll().stream()
                .map(ConquistaResponseDTO::new)
                .collect(Collectors.toList());
    }

    /**
     * Atualiza uma conquista existente.
     * @param identificador O ID da conquista a ser atualizada.
     * @param requestDTO Os novos dados para a conquista.
     * @return A conquista com os dados atualizados.
     */
    public ConquistaResponseDTO atualizarConquista(Long identificador, ConquistaRequestDTO requestDTO) {
        Conquista conquistaExistente = conquistaRepository.findById(identificador)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Conquista não encontrada com o ID: " + identificador));

        conquistaExistente.setNome(requestDTO.getNome());
        conquistaExistente.setDescricao(requestDTO.getDescricao());
        conquistaExistente.setMeta(requestDTO.getMeta());
        conquistaExistente.setPontos(requestDTO.getPontos());
        conquistaExistente.setTipo(requestDTO.getTipo());

        Conquista conquistaAtualizada = conquistaRepository.save(conquistaExistente);
        return new ConquistaResponseDTO(conquistaAtualizada);
    }

    /**
     * Deleta uma conquista do sistema.
     * @param identificador O ID da conquista a ser deletada.
     */
    public void deletarConquista(Long identificador) {
        if (!conquistaRepository.existsById(identificador)) {
            throw new RecursoNaoEncontradoException("Conquista não encontrada com o ID: " + identificador);
        }
        conquistaRepository.deleteById(identificador);
    }
}
