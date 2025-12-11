package br.pucgo.ads.projetointegrador.remember.service;

import br.pucgo.ads.projetointegrador.plataforma.Exception.RecursoNaoEncontradoException;
import br.pucgo.ads.projetointegrador.remember.dto.conquista.ConquistaRequestDTO;
import br.pucgo.ads.projetointegrador.remember.dto.conquista.ConquistaRequestEditDTO;
import br.pucgo.ads.projetointegrador.remember.dto.conquista.ConquistaResponseDTO;
import br.pucgo.ads.projetointegrador.remember.entity.Conquista;
import br.pucgo.ads.projetointegrador.remember.repository.ConquistaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.FileSystems;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Base64;
import java.util.Comparator;
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

        if (requestDTO.getIcone() != null && !requestDTO.getIcone().isEmpty()) {
            try {
                String base64String = requestDTO.getIcone();

                if (base64String.contains(",")) {
                    base64String = base64String.split(",")[1];
                }

                byte[] imageBytes = Base64.getDecoder().decode(base64String);
                Path caminho = Paths.get(CAMINHO_CONQUISTAS,
                        getNomeArquivoConquista(conquistaSalva.getIdentificadorConquista()));

                Files.write(caminho, imageBytes);
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
        return new ConquistaResponseDTO(conquistaSalva);
    }

    /**
     * Busca uma conquista pelo seu identificador.
     * @param identificador O ID da conquista.
     * @return Os dados da conquista encontrada.
     */
    public ConquistaResponseDTO buscarConquistaPorId(Long identificador) {
        return conquistaRepository.findById(identificador).map(this::prepararDTO).orElse(null);
    }

    /**
     * Lista todas as conquistas disponíveis no sistema.
     * @return Uma lista com todas as conquistas.
     */
    public List<ConquistaResponseDTO> listarConquistas() {
        return conquistaRepository.findAll().stream()
                .sorted(Comparator.comparing(Conquista::getIdentificadorConquista))
                .map(this::prepararDTO)
                .collect(Collectors.toList());
    }

    /**
     * Atualiza uma conquista existente.
     * @param identificador O ID da conquista a ser atualizada.
     * @param requestDTO Os novos dados para a conquista.
     * @return A conquista com os dados atualizados.
     */
    public ConquistaResponseDTO atualizarConquista(Long identificador, ConquistaRequestEditDTO requestDTO) {
        Conquista conquistaExistente = conquistaRepository.findById(identificador)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Conquista não encontrada com o ID: " + identificador));

        conquistaExistente.setNome(requestDTO.getNome());
        conquistaExistente.setDescricao(requestDTO.getDescricao());

        return new ConquistaResponseDTO(conquistaRepository.save(conquistaExistente));
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

    private String getNomeArquivoConquista(Long IdentificadorConquista) {
        return String.format("cnqst_%d.png", IdentificadorConquista);
    }

    public ConquistaResponseDTO prepararDTO(Conquista conquista) {
        ConquistaResponseDTO dto = new ConquistaResponseDTO(conquista);

        try {
            Path caminhoArquivo = Paths.get(CAMINHO_CONQUISTAS,
                    getNomeArquivoConquista(conquista.getIdentificadorConquista()));

            if (Files.exists(caminhoArquivo)) {
                byte[] bytes = Files.readAllBytes(caminhoArquivo);
                dto.setIcone("data:image/png;base64," + Base64.getEncoder().encodeToString(bytes));
            } else {
                dto.setIcone(null);
            }
        } catch (IOException e) {
            e.printStackTrace();
            dto.setIcone(null);
        }

        return dto;
    }
}
