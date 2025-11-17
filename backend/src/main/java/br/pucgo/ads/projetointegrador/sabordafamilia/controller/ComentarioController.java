package br.pucgo.ads.projetointegrador.sabordafamilia.controller;

import br.pucgo.ads.projetointegrador.sabordafamilia.entity.Comentario;
import br.pucgo.ads.projetointegrador.sabordafamilia.entity.Receita;
import br.pucgo.ads.projetointegrador.sabordafamilia.entity.Usuario;
import br.pucgo.ads.projetointegrador.sabordafamilia.service.*;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map; // <-- IMPORT NECESSÁRIO

@RestController
@RequestMapping("/api/sabordafamilia/receitas/{receitaId}/comentarios")
@CrossOrigin
public class ComentarioController {

    private final ComentarioService comentarioService;

    public ComentarioController(ComentarioService comentarioService) {
        this.comentarioService = comentarioService;
    }

    // --- MÉTODO PARA CRIAR COMENTÁRIO ---
    // Responde ao POST em /api/sabordafamilia/receitas/{receitaId}/comentarios
    @PostMapping
    public ResponseEntity<Comentario> adicionarComentario(
            @PathVariable Long receitaId, // Pega o ID da receita pela URL
            @RequestBody Map<String, String> payload, // Pega o JSON com o campo "texto"
            @RequestHeader("X-User-Id") Long userId) { // Pega o usuário logado pelo Header

        // 1. Cria o objeto Comentario
        Comentario novoComentario = new Comentario();
        novoComentario.setTexto(payload.get("texto"));

        // 2. Chama o service que faz a lógica de "amarrar" e salvar
        // (O ComentarioService já foi corrigido para lidar com isso)
        Comentario salvo = comentarioService.adicionar(receitaId, userId, novoComentario);

        return ResponseEntity.ok(salvo);
    }

    // --- MÉTODO PARA LISTAR COMENTÁRIOS ---
    // Responde ao GET em /api/sabordafamilia/receitas/{receitaId}/comentarios
    @GetMapping
    public ResponseEntity<List<Comentario>> listarComentarios(@PathVariable Long receitaId) {
        List<Comentario> comentarios = comentarioService.listarPorReceita(receitaId);
        return ResponseEntity.ok(comentarios);
    }
}