package br.pucgo.ads.projetointegrador.DoseCertaApp.controller;

import br.pucgo.ads.projetointegrador.DoseCertaApp.model.MedicamentoHorario;
import br.pucgo.ads.projetointegrador.DoseCertaApp.service.MedicamentoHorarioService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/horarios")
public class MedicamentoHorarioController {

    private final MedicamentoHorarioService service;

    public MedicamentoHorarioController(MedicamentoHorarioService service) {
        this.service = service;
    }

    @GetMapping("/medicamento/{id}")
    public List<MedicamentoHorario> listar(@PathVariable Long id) {
        return service.listarPorMedicamento(id);
    }

    @PatchMapping("/{id}/check")
    public MedicamentoHorario marcar(@PathVariable Long id,
                                     @RequestParam(required = false) Boolean tomado) {
        return service.marcarTomado(id, tomado);
    }
}
