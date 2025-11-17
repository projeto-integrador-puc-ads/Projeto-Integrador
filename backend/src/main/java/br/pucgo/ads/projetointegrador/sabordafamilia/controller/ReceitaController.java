package br.pucgo.ads.projetointegrador.sabordafamilia.controller;

import br.pucgo.ads.projetointegrador.sabordafamilia.entity.Midia;
import br.pucgo.ads.projetointegrador.sabordafamilia.entity.Receita;
import br.pucgo.ads.projetointegrador.sabordafamilia.service.MidiaService;
import br.pucgo.ads.projetointegrador.sabordafamilia.service.ReceitaService;
import br.pucgo.ads.projetointegrador.sabordafamilia.service.UsuarioService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/sabordafamilia/receitas")
public class ReceitaController {

    private final ReceitaService receitaService;
    private final UsuarioService usuarioService;
    private final MidiaService midiaService;

    public ReceitaController(ReceitaService receitaService, 
                             UsuarioService usuarioService, 
                             MidiaService midiaService) {
        this.receitaService = receitaService;
        this.usuarioService = usuarioService;
        this.midiaService = midiaService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<Receita> buscarPorId(
            @PathVariable Long id,
            @RequestHeader(value = "X-User-Id", required = false) Long userId) {
        
        Receita receita = receitaService.buscarPorId(id, userId); 
        return ResponseEntity.ok(receita);
    }

    @GetMapping
    public ResponseEntity<List<Receita>> listarTodas() {
        List<Receita> receitas = receitaService.listarTodas();
        return ResponseEntity.ok(receitas);
    }

    @GetMapping("/seguindo")
    public ResponseEntity<List<Receita>> listarReceitasSeguindo(
            @RequestHeader("X-User-Id") Long userId) {
        // Chama o novo método do service
        List<Receita> receitas = receitaService.listarReceitasDeAutoresFavoritos(userId);
        return ResponseEntity.ok(receitas);
    }

    @PostMapping
    public ResponseEntity<Receita> criar(
            @RequestBody Receita receita,
            @RequestHeader("X-User-Id") Long userId) {

        usuarioService.getById(userId)
                .ifPresent(receita::setAutor);

        if (receita.getRestricoes() != null) {
            receita.getRestricoes().setReceita(receita);
        }

        Receita salva = receitaService.salvar(receita);
        return ResponseEntity.ok(salva);
    }

    @PostMapping("/{id}/curtidas")
    public ResponseEntity<?> curtirReceita(
            @PathVariable Long id,
            @RequestHeader("X-User-Id") Long userId) {

        boolean result = receitaService.curtirReceita(id, userId);
        return ResponseEntity.ok(Map.of("success", result));
    }

    @PostMapping("/{id}/midia")
    public ResponseEntity<Midia> adicionarMidia(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file,
            @RequestParam("tipo_midia") String tipoMidia) {
        
        Receita receita = receitaService.buscarPorId(id, null); 
        
        try {
            Midia midiaSalva = midiaService.salvarMidia(file, receita, tipoMidia);
            return ResponseEntity.ok(midiaSalva);
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(500).build();
        }
    }
}