package br.pucgo.ads.projetointegrador.remember.service;

import br.pucgo.ads.projetointegrador.plataforma.Exception.RecursoNaoEncontradoException;
import br.pucgo.ads.projetointegrador.plataforma.entity.User;
import br.pucgo.ads.projetointegrador.plataforma.repository.UserRepository;
import br.pucgo.ads.projetointegrador.remember.dto.conquista.UsuarioConquistaResponseDTO;
import br.pucgo.ads.projetointegrador.remember.entity.Conquista;
import br.pucgo.ads.projetointegrador.remember.entity.UsuarioConquista;
import br.pucgo.ads.projetointegrador.remember.key.UsuarioConquistaKey;
import br.pucgo.ads.projetointegrador.remember.repository.ConquistaRepository;
import br.pucgo.ads.projetointegrador.remember.repository.UsuarioConquistaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UsuarioConquistaService {

    private final UsuarioConquistaRepository usuarioConquistaRepository;
    private final UserRepository usuarioRepository;
    private final ConquistaRepository conquistaRepository;

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
    public List<UsuarioConquistaResponseDTO> listarConquistasPorUsuario(Long identificadorUsuario) {
        if (!usuarioRepository.existsById(identificadorUsuario)) {
            throw new RecursoNaoEncontradoException("Usuário não encontrado com o ID: " + identificadorUsuario);
        }

        return usuarioConquistaRepository.findByUsuarioConquistaKey_IdentificadorUsuario(identificadorUsuario)
                .stream().map(UsuarioConquistaResponseDTO::new).collect(Collectors.toList());
    }
}
