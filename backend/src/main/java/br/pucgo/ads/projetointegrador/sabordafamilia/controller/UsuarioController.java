package br.pucgo.ads.projetointegrador.sabordafamilia.controller;

import br.pucgo.ads.projetointegrador.sabordafamilia.entity.Receita;
import br.pucgo.ads.projetointegrador.sabordafamilia.entity.Usuario;
import br.pucgo.ads.projetointegrador.sabordafamilia.repository.UsuarioRepository;
import br.pucgo.ads.projetointegrador.sabordafamilia.service.ReceitaService; // Import necessário
import br.pucgo.ads.projetointegrador.sabordafamilia.service.UsuarioService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.transaction.annotation.Transactional; // <-- IMPORT NECESSÁRIO

import java.util.ArrayList;
import java.util.List; // Import necessário
import java.util.Map;

@RestController
@RequestMapping("/api/sabordafamilia/usuarios")
@CrossOrigin
public class UsuarioController {

    private final UsuarioService usuarioService;
    private final UsuarioRepository usuarioRepository;
    private final ReceitaService receitaService; // <-- INJETAR O RECEITASERVICE

    public UsuarioController(UsuarioService usuarioService, UsuarioRepository usuarioRepository, ReceitaService receitaService) {
        this.usuarioService = usuarioService;
        this.usuarioRepository = usuarioRepository;
        this.receitaService = receitaService; // <-- INICIALIZAR
    }

    @GetMapping("/{id}")
    public ResponseEntity<Usuario> getUsuarioPorId(@PathVariable Long id) {
        Usuario usuario = usuarioService.getById(id)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        return ResponseEntity.ok(usuario);
    }

    @GetMapping("/{id}/receitas")
    @Transactional(readOnly = true) // Garante que o JOIN FETCH funcione
    public ResponseEntity<List<Receita>> getReceitasDoUsuario(@PathVariable Long id) {
        // Usa o ReceitaService para buscar receitas por autor
        List<Receita> receitas = receitaService.listarPorAutor(id); 
        return ResponseEntity.ok(receitas);
    }

    // Perfil do usuário logado
    @GetMapping("/me")
    public ResponseEntity<Usuario> getPerfil(@RequestHeader("X-User-Id") Long userId) {
        Usuario usuario = usuarioService.getById(userId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        return ResponseEntity.ok(usuario);
    }
    
    // Método para a página "Minhas Receitas"
    @GetMapping("/me/receitas")
    public ResponseEntity<List<Receita>> getMinhasReceitas(@RequestHeader("X-User-Id") Long userId) {
        List<Receita> receitas = receitaService.listarPorAutor(userId); 
        return ResponseEntity.ok(receitas);
    }

    // Mantém a sessão do banco aberta para carregar a lista 'getFavoritos()'
    @Transactional(readOnly = true)
    @GetMapping("/me/favoritos")
    public ResponseEntity<?> getFavoritos(@RequestHeader("X-User-Id") Long userId) {
        Usuario usuario = usuarioRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        return ResponseEntity.ok(new ArrayList<>(usuario.getFavoritos()));
    }

    @Transactional
    @PostMapping("/me/favoritos/{idReceita}")
    public ResponseEntity<?> favoritarReceita(
            @PathVariable Long idReceita,
            @RequestHeader("X-User-Id") Long userId) {

        boolean result = usuarioService.favoritarReceita(userId, idReceita);
        return ResponseEntity.ok(Map.of("success", result));
    }

}