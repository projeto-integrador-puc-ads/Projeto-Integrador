package br.pucgo.ads.projetointegrador.remember.service;

import br.pucgo.ads.projetointegrador.plataforma.Exception.RecursoNaoEncontradoException;
import br.pucgo.ads.projetointegrador.remember.dto.lembranca.LembrancaRequestDTO;
import br.pucgo.ads.projetointegrador.remember.dto.lembranca.LembrancaResponseDTO;
import br.pucgo.ads.projetointegrador.remember.entity.Lembranca;
import br.pucgo.ads.projetointegrador.remember.repository.LembrancaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class LembrancaService {

    private final LembrancaRepository lembrancaRepository;

    @Autowired
    public LembrancaService(LembrancaRepository lembrancaRepository) {
        this.lembrancaRepository = lembrancaRepository;
    }

    /**
     * Salva uma nova lembrança no banco de dados.
     * @param requestDTO Os dados da lembrança a ser salva.
     * @return A lembrança salva com os dados gerados pelo sistema.
     */
    public LembrancaResponseDTO salvarLembranca(LembrancaRequestDTO requestDTO) {
        Lembranca novaLembranca = new Lembranca();

        novaLembranca.setIdentificadorUsuario(requestDTO.getIdentificadorUsuario());
        novaLembranca.setTitulo(requestDTO.getTitulo());
        novaLembranca.setDataAcontecimento(requestDTO.getDataAcontecimento());
        novaLembranca.setPessoasPresentes(requestDTO.getPessoasPresentes());
        novaLembranca.setLocal(requestDTO.getLocal());
        novaLembranca.setHistoria(requestDTO.getHistoria());

        Lembranca lembrancaSalva = lembrancaRepository.save(novaLembranca);
        return new LembrancaResponseDTO(lembrancaSalva);
    }

    /**
     * Busca uma lembrança pelo seu identificador único.
     * @param identificador O ID da lembrança.
     * @return Os dados da lembrança encontrada.
     */
    public LembrancaResponseDTO buscarLembrancaPorIdentificador(Long identificador) {
        Lembranca lembranca = lembrancaRepository.findById(identificador)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Lembrança não encontrada com o ID: " + identificador));
        return new LembrancaResponseDTO(lembranca);
    }

    /**
     * Lista todas as lembranças de um usuário específico.
     * @param identificadorUsuario O ID do usuário.
     * @return Uma lista com as lembranças do usuário.
     */
    public List<LembrancaResponseDTO> listarLembrancasPorUsuario(Long identificadorUsuario) {
        List<Lembranca> lembrancas = lembrancaRepository.findAllByIdentificadorUsuarioOrderByDataAcontecimentoDesc(identificadorUsuario);
        return lembrancas.stream()
                .map(LembrancaResponseDTO::new)
                .collect(Collectors.toList());
    }

    /**
     * Atualiza uma lembrança existente.
     * @param identificador O ID da lembrança a ser atualizada.
     * @param requestDTO Os novos dados para a lembrança.
     * @return A lembrança com os dados atualizados.
     */
    public LembrancaResponseDTO atualizarLembranca(Long identificador, LembrancaRequestDTO requestDTO) {
        Lembranca lembrancaExistente = lembrancaRepository.findById(identificador)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Lembrança não encontrada com o ID: " + identificador));

        lembrancaExistente.setTitulo(requestDTO.getTitulo());
        lembrancaExistente.setDataAcontecimento(requestDTO.getDataAcontecimento());
        lembrancaExistente.setPessoasPresentes(requestDTO.getPessoasPresentes());
        lembrancaExistente.setLocal(requestDTO.getLocal());
        lembrancaExistente.setHistoria(requestDTO.getHistoria());

        Lembranca lembrancaAtualizada = lembrancaRepository.save(lembrancaExistente);
        return new LembrancaResponseDTO(lembrancaAtualizada);
    }

    /**
     * Deleta uma lembrança pelo seu identificador.
     * @param identificador O ID da lembrança a ser deletada.
     */
    public void deletarLembranca(Long identificador) {
        if (!lembrancaRepository.existsById(identificador)) {
            throw new RecursoNaoEncontradoException("Lembrança não encontrada com o ID: " + identificador);
        }
        lembrancaRepository.deleteById(identificador);
    }
}
