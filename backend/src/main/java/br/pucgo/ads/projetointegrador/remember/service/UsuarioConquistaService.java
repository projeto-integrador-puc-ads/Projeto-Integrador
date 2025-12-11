package br.pucgo.ads.projetointegrador.remember.service;

import br.pucgo.ads.projetointegrador.plataforma.Exception.RecursoNaoEncontradoException;
import br.pucgo.ads.projetointegrador.plataforma.entity.User;
import br.pucgo.ads.projetointegrador.plataforma.repository.UserRepository;
import br.pucgo.ads.projetointegrador.remember.dto.conquista.ConquistaResponseDTO;
import br.pucgo.ads.projetointegrador.remember.dto.conquista.RankingProjection;
import br.pucgo.ads.projetointegrador.remember.dto.conquista.RankingResponseDTO;
import br.pucgo.ads.projetointegrador.remember.dto.conquista.UsuarioConquistaResponseDTO;
import br.pucgo.ads.projetointegrador.remember.entity.Conquista;
import br.pucgo.ads.projetointegrador.remember.entity.UsuarioConquista;
import br.pucgo.ads.projetointegrador.remember.key.UsuarioConquistaKey;
import br.pucgo.ads.projetointegrador.remember.repository.ConquistaRepository;
import br.pucgo.ads.projetointegrador.remember.repository.UsuarioConquistaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.nio.file.FileSystems;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Base64;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class UsuarioConquistaService {

    private final UsuarioConquistaRepository usuarioConquistaRepository;
    private final UserRepository usuarioRepository;
    private final ConquistaRepository conquistaRepository;

    private static final String SEPARADOR = FileSystems.getDefault().getSeparator();
    private static final String CAMINHO_CONQUISTAS = SEPARADOR + "arquivos" + SEPARADOR + "remember" + SEPARADOR +
            "imagens" + SEPARADOR + "conquistas" + SEPARADOR;

    @Autowired
    public UsuarioConquistaService(
            UsuarioConquistaRepository usuarioConquistaRepository,
            UserRepository usuarioRepository,
            ConquistaRepository conquistaRepository
    ) {
        this.usuarioConquistaRepository = usuarioConquistaRepository;
        this.usuarioRepository = usuarioRepository;
        this.conquistaRepository = conquistaRepository;
    }

    /**
     * Concede uma conquista a um usuário específico.
     * @param identificadorUsuario O ID do usuário que receberá a conquista.
     * @param identificadorConquista O ID da conquista a ser concedida.
     * @return O registro da conquista que foi atribuída ao usuário.
     */
    public UsuarioConquistaResponseDTO concederConquista(Long identificadorUsuario, Long identificadorConquista) {
        User usuario = usuarioRepository.findById(identificadorUsuario)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Usuário não encontrado com o ID: " + identificadorUsuario));
        Conquista conquista = conquistaRepository.findById(identificadorConquista)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Conquista não encontrada com o ID: " + identificadorConquista));

        UsuarioConquistaKey usuarioConquistaKey = new UsuarioConquistaKey(identificadorUsuario, identificadorConquista);

        if (usuarioConquistaRepository.existsById(usuarioConquistaKey)) {
            throw new IllegalStateException("Usuário já possui esta conquista.");
        }

        UsuarioConquista novaConquistaUsuario = new UsuarioConquista();
        novaConquistaUsuario.setUsuarioConquistaKey(usuarioConquistaKey);
        novaConquistaUsuario.setUsuario(usuario);
        novaConquistaUsuario.setConquista(conquista);

        UsuarioConquista conquistaSalva = usuarioConquistaRepository.save(novaConquistaUsuario);
        return new UsuarioConquistaResponseDTO(conquistaSalva);
    }

    /**
     * Lista todas as conquistas que um usuário já ganhou.
     * @param identificadorUsuario O ID do usuário.
     * @return Uma lista com as conquistas do usuário.
     */
    @Transactional(readOnly = true)
    public List<UsuarioConquistaResponseDTO> listarConquistasPorUsuario(Long identificadorUsuario) {
        return usuarioConquistaRepository.findByUsuarioConquistaKey_IdentificadorUsuarioOrderByDataObtencaoAsc(identificadorUsuario)
                .stream().map(this::prepararDTO)
                .collect(Collectors.toList());
    }

    public List<RankingResponseDTO> buscarTop3Ranking() {
        List<RankingProjection> projecoes = usuarioConquistaRepository
                .buscarRankingGeral(PageRequest.of(0, 3));

        return projecoes.stream()
                .map(p -> new RankingResponseDTO(p.getNomeUsuario(), p.getTotalPontos()))
                .collect(Collectors.toList());
    }

    private String getNomeArquivoConquista(Long IdentificadorConquista) {
        return String.format("cnqst_%d.png", IdentificadorConquista);
    }

    private UsuarioConquistaResponseDTO prepararDTO(UsuarioConquista usuarioConquista) {
        UsuarioConquistaResponseDTO dto = new UsuarioConquistaResponseDTO(usuarioConquista);

        try {
            Path caminhoArquivo = Paths.get(CAMINHO_CONQUISTAS,
                    getNomeArquivoConquista(usuarioConquista.getConquista().getIdentificadorConquista()));

            if (Files.exists(caminhoArquivo)) {
                byte[] bytes = Files.readAllBytes(caminhoArquivo);
                dto.getConquista().setIcone("data:image/png;base64," + Base64.getEncoder().encodeToString(bytes));
            } else {
                dto.getConquista().setIcone(null);
            }
        } catch (IOException e) {
            e.printStackTrace();
            dto.getConquista().setIcone(null);
        }

        return dto;
    }
}
