package br.pucgo.ads.projetointegrador.eldercare.controller;

import br.pucgo.ads.projetointegrador.eldercare.domain.ex_plano;
import br.pucgo.ads.projetointegrador.eldercare.dto.PlanoGeradoResponse;
import br.pucgo.ads.projetointegrador.eldercare.service.PlanoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/eldercare/planos")
public class PlanoController {

    private final PlanoService planoService;

    public PlanoController(PlanoService planoService) {
        this.planoService = planoService;
    }

    /** Retorna o plano em forma “crua” (entidade) */
    @GetMapping("/{id}")
    public ResponseEntity<ex_plano> buscar(@PathVariable UUID id) {
        return ResponseEntity.ok(planoService.buscar(id));
    }

    /** Retorna a lista de planos de um participante */
    @GetMapping("/participante/{participanteId}")
    public ResponseEntity<List<ex_plano>> listarPorParticipante(@PathVariable UUID participanteId) {
        return ResponseEntity.ok(planoService.listarPorParticipante(participanteId));
    }

    /** (Opcional) Retorna o DTO já pronto para a tela de “Plano Gerado” */
    @GetMapping("/{id}/view")
    public ResponseEntity<PlanoGeradoResponse> detalharParaView(@PathVariable UUID id) {
        return ResponseEntity.ok(planoService.montarPlanoGeradoResponse(id));
    }
}
