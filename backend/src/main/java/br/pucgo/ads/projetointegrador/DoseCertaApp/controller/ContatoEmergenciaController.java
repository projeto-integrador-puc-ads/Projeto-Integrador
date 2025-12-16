package br.pucgo.ads.projetointegrador.DoseCertaApp.controller;

import br.pucgo.ads.projetointegrador.DoseCertaApp.dto.ContatoEmergenciaDTO;
import br.pucgo.ads.projetointegrador.DoseCertaApp.dto.ContatoEmergenciaResponseDTO;
import br.pucgo.ads.projetointegrador.DoseCertaApp.model.ContatoEmergencia;
import br.pucgo.ads.projetointegrador.DoseCertaApp.service.ContatoEmergenciaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/contatos-emergencia")
public class ContatoEmergenciaController {

    private final ContatoEmergenciaService service;

    public ContatoEmergenciaController(ContatoEmergenciaService service) {
        this.service = service;
    }

    @GetMapping("/{usuarioId}")
    public List<ContatoEmergenciaResponseDTO> listarPorUsuario(@PathVariable Long usuarioId) {
        return service.listarPorUsuario(usuarioId)
                .stream()
                .map(ContatoEmergenciaResponseDTO::new)
                .toList();
    }


    @PostMapping
    public ContatoEmergenciaResponseDTO criar(@RequestBody ContatoEmergenciaDTO dto) {
        ContatoEmergencia contato = service.criar(dto);
        return new ContatoEmergenciaResponseDTO(contato);
    }

    // 🔹 Atualizar contato
    @PutMapping("/{id}")
    public ContatoEmergenciaResponseDTO atualizar(
            @PathVariable Long id,
            @RequestBody ContatoEmergenciaDTO dto
    ) {
        ContatoEmergencia contato = service.atualizar(id, dto);
        return new ContatoEmergenciaResponseDTO(contato);
    }

    // 🔹 Excluir contato
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        service.excluir(id);
        return ResponseEntity.noContent().build();
    }
}
