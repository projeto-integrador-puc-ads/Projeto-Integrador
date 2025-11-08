package br.pucgo.ads.projetointegrador.carehub.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.pucgo.ads.projetointegrador.carehub.entity.Usuario;
import br.pucgo.ads.projetointegrador.carehub.repository.UsuarioRepository;

import java.util.List;
import java.util.Objects;

@Service
public class AdminService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    public List<Usuario> listarTodosUsuarios() {
        return usuarioRepository.findAll();
    }

    public Usuario buscarUsuarioPorId(Long id) {
        Objects.requireNonNull(id, "id não pode ser nulo");
        return usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
    }

    @Transactional
    public Usuario alterarStatusUsuario(Long id, Boolean ativo) {
        Objects.requireNonNull(id, "id não pode ser nulo");
        Objects.requireNonNull(ativo, "ativo não pode ser nulo");
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
    usuario.setAtivo(ativo);
    return usuarioRepository.save(Objects.requireNonNull(usuario));
    }

    @Transactional
    public void deletarUsuario(Long id) {
        Objects.requireNonNull(id, "id não pode ser nulo");
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
    usuarioRepository.delete(Objects.requireNonNull(usuario));
    }
}
