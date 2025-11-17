package br.pucgo.ads.projetointegrador.sabordafamilia.service;

import br.pucgo.ads.projetointegrador.sabordafamilia.entity.Receita;
import br.pucgo.ads.projetointegrador.sabordafamilia.entity.Usuario;
import br.pucgo.ads.projetointegrador.sabordafamilia.repository.ReceitaRepository;
import br.pucgo.ads.projetointegrador.sabordafamilia.repository.UsuarioRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final ReceitaRepository receitaRepository;

    public UsuarioService(UsuarioRepository usuarioRepository, ReceitaRepository receitaRepository) {
        this.usuarioRepository = usuarioRepository;
        this.receitaRepository = receitaRepository;
    }

    public Optional<Usuario> getById(Long id) {
        return usuarioRepository.findById(id);
    }

    public boolean favoritarReceita(Long userId, Long receitaId) {
        Usuario usuario = usuarioRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        Receita receita = receitaRepository.findById(receitaId)
                .orElseThrow(() -> new RuntimeException("Receita não encontrada"));

        // Alterna o estado de favorito
        if (usuario.getFavoritos().contains(receita)) {
            usuario.getFavoritos().remove(receita);
        } else {
            usuario.getFavoritos().add(receita);
        }

        usuarioRepository.save(usuario);
        return true;
    }
}
