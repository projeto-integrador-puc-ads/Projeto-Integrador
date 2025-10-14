package br.pucgo.ads.projetointegrador.remember.service;

import br.pucgo.ads.projetointegrador.plataforma.Exception.RecursoNaoEncontradoException;
import br.pucgo.ads.projetointegrador.remember.dto.diario.DiarioRequestDTO;
import br.pucgo.ads.projetointegrador.remember.dto.diario.DiarioResponseDTO;
import br.pucgo.ads.projetointegrador.remember.entity.Diario;
import br.pucgo.ads.projetointegrador.remember.repository.DiarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DiarioService {

    private final DiarioRepository diarioRepository;

    @Autowired
    public DiarioService(DiarioRepository diarioRepository) {
        this.diarioRepository = diarioRepository;
    }

    /**
     * Salva uma nova página do diário (apenas texto) no banco de dados.
     * @param requestDTO Os dados do diário a ser salvo.
     * @return O diário salvo com os dados gerados pelo sistema.
     */
    public DiarioResponseDTO salvarDiario(DiarioRequestDTO requestDTO) {
        Diario novoDiario = new Diario();

        novoDiario.setIdentificadorUsuario(requestDTO.getIdentificadorUsuario());
        novoDiario.setTitulo(requestDTO.getTitulo());
        novoDiario.setConteudo(requestDTO.getConteudo());
        novoDiario.setDataEscrita(requestDTO.getDataEscrita());

        Diario diarioSalvo = diarioRepository.save(novoDiario);
        return new DiarioResponseDTO(diarioSalvo);
    }

    /**
     * Busca uma página do diário pelo seu identificador único.
     * @param identificador O ID do diário.
     * @return Os dados do diário encontrado.
     */
    public DiarioResponseDTO buscarDiarioPorId(Long identificador) {
        Diario diario = diarioRepository.findById(identificador)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Diário não encontrado com o ID: " + identificador));
        return new DiarioResponseDTO(diario);
    }

    /**
     * Lista todas as páginas do diário de um usuário específico.
     * @param identificadorUsuario O ID do usuário.
     * @return Uma lista com as páginas do diário do usuário.
     */
    public List<DiarioResponseDTO> listarDiariosPorUsuario(Long identificadorUsuario) {
        List<Diario> diarios = diarioRepository.findAllByIdentificadorUsuarioOrderByDataEscritaDesc(identificadorUsuario);
        return diarios.stream()
                .map(DiarioResponseDTO::new)
                .collect(Collectors.toList());
    }

    /**
     * Atualiza uma página do diário existente.
     * @param identificador O ID do diário a ser atualizado.
     * @param requestDTO Os novos dados para o diário.
     * @return O diário com os dados atualizados.
     */
    public DiarioResponseDTO atualizarDiario(Long identificador, DiarioRequestDTO requestDTO) {
        Diario diarioExistente = diarioRepository.findById(identificador)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Diário não encontrado com o ID: " + identificador));

        diarioExistente.setTitulo(requestDTO.getTitulo());
        diarioExistente.setConteudo(requestDTO.getConteudo());
        diarioExistente.setDataEscrita(requestDTO.getDataEscrita());

        Diario diarioAtualizado = diarioRepository.save(diarioExistente);
        return new DiarioResponseDTO(diarioAtualizado);
    }

    /**
     * Deleta uma página do diário pelo seu identificador.
     * @param identificador O ID do diário a ser deletado.
     */
    public void deletarDiario(Long identificador) {
        if (!diarioRepository.existsById(identificador)) {
            throw new RecursoNaoEncontradoException("Diário não encontrado com o ID: " + identificador);
        }
        diarioRepository.deleteById(identificador);
    }
}
