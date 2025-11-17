package br.pucgo.ads.projetointegrador.sabordafamilia.service;

import br.pucgo.ads.projetointegrador.sabordafamilia.entity.Receita;
import br.pucgo.ads.projetointegrador.sabordafamilia.entity.Usuario;
import br.pucgo.ads.projetointegrador.sabordafamilia.repository.ReceitaRepository;
import br.pucgo.ads.projetointegrador.sabordafamilia.repository.UsuarioRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList; // Importar
import java.util.List;
import java.util.Set; // Importar
import java.util.stream.Collectors; // Importar

@Service
public class ReceitaService {

    private final ReceitaRepository receitaRepository;
    private final UsuarioRepository usuarioRepository;

    public ReceitaService(ReceitaRepository receitaRepository, UsuarioRepository usuarioRepository) {
        this.receitaRepository = receitaRepository;
        this.usuarioRepository = usuarioRepository;
    }

    public Receita salvar(Receita receita) {
        return receitaRepository.save(receita);
    }

    @Transactional(readOnly = true)
    public Receita buscarPorId(Long id, Long userId) { 
        Receita receita = receitaRepository.findByIdWithCollections(id)
                .orElseThrow(() -> new RuntimeException("Receita não encontrada"));

        if (userId != null && receita.getUsuariosCurtiram() != null) {
            for (Usuario usuarioQueCurtiu : receita.getUsuariosCurtiram()) {
                if (usuarioQueCurtiu.getId().equals(userId)) {
                    receita.setCurtidaPeloUsuarioAtual(true);
                    break; 
                }
            }
        }
        return receita;
    }

    @Transactional(readOnly = true) 
    public List<Receita> listarTodas() {
        return receitaRepository.findAllWithAutorMidiasAndCurtidas(); 
    }

    @Transactional(readOnly = true)
    public List<Receita> listarPorAutor(Long autorId) {
        return receitaRepository.findByAutorId(autorId);
    }

    @Transactional
    public boolean curtirReceita(Long receitaId, Long userId) {
        
        Receita receita = receitaRepository.findByIdWithCollections(receitaId)
                .orElseThrow(() -> new RuntimeException("Receita não encontrada"));

        Usuario usuario = usuarioRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        if (receita.getUsuariosCurtiram().contains(usuario)) {
            receita.getUsuariosCurtiram().remove(usuario);
        } else {
            receita.getUsuariosCurtiram().add(usuario);
        }
        
        return true;
    }

    @Transactional(readOnly = true)
    public List<Receita> listarReceitasDeAutoresFavoritos(Long userId) {
        // 1. Busca o usuário e suas receitas favoritas
        Usuario usuario = usuarioRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        // 2. Pega a lista de receitas que ele favoritou
        Set<Receita> receitasFavoritas = usuario.getFavoritos();
        
        // Se ele não favoritou nada, retorna uma lista vazia
        if (receitasFavoritas == null || receitasFavoritas.isEmpty()) {
            return new ArrayList<>();
        }

        // 3. Mapeia a lista de receitas para uma lista de AUTORES únicos
        Set<Usuario> autoresFavoritos = receitasFavoritas.stream()
            .map(Receita::getAutor) // Pega o autor de cada receita favorita
            .collect(Collectors.toSet()); // Coleta em um Set (remove duplicados)

        // Se não houver autores, retorna uma lista vazia
        if (autoresFavoritos.isEmpty()) {
            return new ArrayList<>();
        }

        // 4. Usa a nova query do repositório para buscar todas as receitas desses autores
        return receitaRepository.findReceitasByAutores(autoresFavoritos);
    }
}