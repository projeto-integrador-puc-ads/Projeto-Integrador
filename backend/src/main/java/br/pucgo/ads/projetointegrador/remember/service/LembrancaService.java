package br.pucgo.ads.projetointegrador.remember.service;

import br.pucgo.ads.projetointegrador.plataforma.Exception.RecursoNaoEncontradoException;
import br.pucgo.ads.projetointegrador.remember.dto.conquista.ConquistaResponseDTO;
import br.pucgo.ads.projetointegrador.remember.dto.lembranca.LembrancaRequestDTO;
import br.pucgo.ads.projetointegrador.remember.dto.lembranca.LembrancaResponseDTO;
import br.pucgo.ads.projetointegrador.remember.dto.lembranca.LembrancaUpdateDTO;
import br.pucgo.ads.projetointegrador.remember.entity.Lembranca;
import br.pucgo.ads.projetointegrador.remember.repository.LembrancaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.FileSystems;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Base64;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class LembrancaService {

    private final LembrancaRepository lembrancaRepository;
    private final GameService gamificationService;

    private static final String SEPARADOR = FileSystems.getDefault().getSeparator();
    private static final String CAMINHO_LEMBRANCAS = SEPARADOR + "arquivos" + SEPARADOR + "remember" + SEPARADOR +
            "imagens" + SEPARADOR + "lembrancas" + SEPARADOR;

    @Autowired
    public LembrancaService(LembrancaRepository lembrancaRepository, GameService gamificationService) {
        this.lembrancaRepository = lembrancaRepository;
        this.gamificationService = gamificationService;
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

        if (requestDTO.getImagem() != null && !requestDTO.getImagem().isEmpty()) {
            try {
                String base64String = requestDTO.getImagem();

                if (base64String.contains(",")) {
                    base64String = base64String.split(",")[1];
                }

                byte[] imageBytes = Base64.getDecoder().decode(base64String);
                Path caminho = Paths.get(getCaminhoArquivoLembranca(lembrancaSalva.getIdentificadorUsuario()),
                        getNomeArquivoLembranca(lembrancaSalva.getIdentificadorLembranca()));

                Files.write(caminho, imageBytes);
            } catch (Exception e) {
                e.printStackTrace();
            }
        }

        LembrancaResponseDTO response = new LembrancaResponseDTO(lembrancaSalva);

        List<ConquistaResponseDTO> conquistasGanhas = gamificationService
                .verificarConquistasLembranca(lembrancaSalva.getIdentificadorUsuario());
        response.setConquistasDesbloqueadas(conquistasGanhas);

        return response;
    }

    /**
     * Busca uma lembrança pelo seu identificador único.
     * @param identificador O ID da lembrança.
     * @return Os dados da lembrança encontrada.
     */
    public LembrancaResponseDTO buscarLembrancaPorId(Long identificador) {
        return lembrancaRepository.findById(identificador).map(this::prepararDTO).orElse(null);
    }

    /**
     * Lista todas as lembranças de um usuário específico.
     * @param identificadorUsuario O ID do usuário.
     * @return Uma lista com as lembranças do usuário.
     */
    public List<LembrancaResponseDTO> listarLembrancasPorUsuario(Long identificadorUsuario) {
        List<Lembranca> lembrancas = lembrancaRepository.findAllByIdentificadorUsuarioOrderByDataAcontecimentoDesc(identificadorUsuario);
        return lembrancas.stream()
                .map(this::prepararDTO)
                .collect(Collectors.toList());
    }

    /**
     * Atualiza uma lembrança existente.
     * @param identificador O ID da lembrança a ser atualizada.
     * @param lembrancaUpdateDto Os novos dados para a lembrança.
     * @return A lembrança com os dados atualizados.
     */
    public LembrancaResponseDTO atualizarLembranca(Long identificador, LembrancaUpdateDTO lembrancaUpdateDto) {
        Lembranca lembrancaExistente = lembrancaRepository.findById(identificador)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Lembrança não encontrada com o ID: " + identificador));

        lembrancaExistente.setTitulo(lembrancaUpdateDto.getTitulo());
        lembrancaExistente.setDataAcontecimento(lembrancaUpdateDto.getDataAcontecimento());
        lembrancaExistente.setPessoasPresentes(lembrancaUpdateDto.getPessoasPresentes());
        lembrancaExistente.setLocal(lembrancaUpdateDto.getLocal());
        lembrancaExistente.setHistoria(lembrancaUpdateDto.getHistoria());

        Lembranca lembrancaAtualizada = lembrancaRepository.save(lembrancaExistente);

        if (lembrancaUpdateDto.getImagem() != null && !lembrancaUpdateDto.getImagem().isEmpty()) {
            try {
                String base64String = lembrancaUpdateDto.getImagem();

                if (base64String.contains(",")) {
                    base64String = base64String.split(",")[1];
                }

                byte[] imageBytes = Base64.getDecoder().decode(base64String);

                Path caminho = Paths.get(getCaminhoArquivoLembranca(lembrancaAtualizada.getIdentificadorUsuario()),
                        getNomeArquivoLembranca(lembrancaAtualizada.getIdentificadorLembranca()));


                Files.createDirectories(caminho.getParent());
                Files.write(caminho, imageBytes);
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
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

    private String getCaminhoArquivoLembranca(Long IdentificadorUsuario) {
        return CAMINHO_LEMBRANCAS + IdentificadorUsuario + SEPARADOR;
    }

    private String getNomeArquivoLembranca(Long IdentificadorLembranca) {
        return String.format("lmbrnc_%d.png", IdentificadorLembranca);
    }

    private LembrancaResponseDTO prepararDTO(Lembranca lembranca) {
        LembrancaResponseDTO dto = new LembrancaResponseDTO(lembranca);

        try {
            Path caminhoArquivo = Paths.get(getCaminhoArquivoLembranca(lembranca.getIdentificadorUsuario()),
                    getNomeArquivoLembranca(lembranca.getIdentificadorLembranca()));

            if (Files.exists(caminhoArquivo)) {
                byte[] bytes = Files.readAllBytes(caminhoArquivo);
                dto.setImagem("data:image/png;base64," + Base64.getEncoder().encodeToString(bytes));
            } else {
                dto.setImagem(null);
            }
        } catch (IOException e) {
            e.printStackTrace();
            dto.setImagem(null);
        }

        return dto;
    }

}
