package br.pucgo.ads.projetointegrador.diario_saude.controller;

import br.pucgo.ads.projetointegrador.diario_saude.entity.DoencasEntity;
import br.pucgo.ads.projetointegrador.diario_saude.entity.UsuarioDoencasEntity;
import br.pucgo.ads.projetointegrador.diario_saude.service.UsuarioDoencaService;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/diario_saude/usuario-doenca")
public class UsuarioDoencaController {

    @Autowired
    private UsuarioDoencaService service;

    @PostMapping("/add")
    public ResponseEntity<?> add(
            @RequestParam Long usuarioId,
            @RequestParam Long doencaId
    ) {
        return ResponseEntity.ok(service.adicionarDoenca(usuarioId, doencaId));
    }

    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<?> listarDoencasDoUsuario(@PathVariable Long usuarioId) {
        try {
            List<UsuarioDoencasEntity> lista = service.listarDoencasPorUsuario(usuarioId);

            // retorna somente as doenças para o front
            List<DoencasEntity> doencas = lista.stream()
                    .map(ude -> ude.getDoenca())
                    .toList();

            return ResponseEntity.ok(doencas);

        } catch (Exception e) {
            return ResponseEntity.status(500).body("Erro ao buscar doenças do usuário.");
        }
    }
    @DeleteMapping("/delete")
    public ResponseEntity<?> remover(
        @RequestParam Long usuarioId,
        @RequestParam Long doencaId
    ) {
        service.removerDoenca(usuarioId, doencaId);
        return ResponseEntity.ok().build();
    }
}
