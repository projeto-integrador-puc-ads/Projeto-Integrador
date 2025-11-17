package br.pucgo.ads.projetointegrador.diario_saude.controller;

import br.pucgo.ads.projetointegrador.diario_saude.service.UsuarioDoencaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/usuario-doenca")
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
}

