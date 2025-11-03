package br.pucgo.ads.projetointegrador.eldercare.controller;

import br.pucgo.ads.projetointegrador.eldercare.dto.PlanoDTO;
import br.pucgo.ads.projetointegrador.eldercare.service.PlanoService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/eldercare/planos")
public class PlanoController {

    private final PlanoService service;
    public PlanoController(PlanoService service) { this.service = service; }

    @GetMapping("/{id}")
    public PlanoDTO buscar(@PathVariable Long id) {
        return service.buscar(id);
    }

    @GetMapping("/idoso/{idosoId}")
    public List<PlanoDTO> listarPorIdoso(@PathVariable Long idosoId) {
        return service.listarPorIdoso(idosoId);
    }
}
