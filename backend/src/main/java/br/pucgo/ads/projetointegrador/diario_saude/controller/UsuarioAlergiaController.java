package br.pucgo.ads.projetointegrador.diario_saude.controller;

import br.pucgo.ads.projetointegrador.diario_saude.entity.AlergiaEntity;
import br.pucgo.ads.projetointegrador.diario_saude.service.UsuarioAlergiaService;
import br.pucgo.ads.projetointegrador.diario_saude.entity.UsuarioAlergiaEntity;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/diario_saude/usuario-alergia")
public class UsuarioAlergiaController {

    @Autowired
    private UsuarioAlergiaService service;

    @PostMapping("/add")
    public ResponseEntity<?> add(
            @RequestParam Long usuarioId,
            @RequestParam Long alergiaId
    ) {
        return ResponseEntity.ok(service.adicionar(usuarioId, alergiaId));
    }

    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<?> listar(@PathVariable Long usuarioId) {
        List<UsuarioAlergiaEntity> lista = service.listarPorUsuario(usuarioId);
        List<AlergiaEntity> alergias = lista.stream()
                .map(ua -> ua.getAlergia())
                .toList();

        return ResponseEntity.ok(alergias);
    }

    @DeleteMapping("/delete")
    public ResponseEntity<?> remover(
            @RequestParam Long usuarioId,
            @RequestParam Long alergiaId
    ) {
        service.remover(usuarioId, alergiaId);
        return ResponseEntity.ok().build();
    }
}
