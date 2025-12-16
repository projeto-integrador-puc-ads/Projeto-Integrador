package br.pucgo.ads.projetointegrador.DoseCertaApp.controller;

import br.pucgo.ads.projetointegrador.DoseCertaApp.dto.RegistroTomadaHistoricoDTO;
import br.pucgo.ads.projetointegrador.DoseCertaApp.model.RegistroTomada;
import br.pucgo.ads.projetointegrador.DoseCertaApp.service.RegistroTomadaService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/registro-tomada")
public class RegistroTomadaController {

    private final RegistroTomadaService service;

    public RegistroTomadaController(RegistroTomadaService service) {
        this.service = service;
    }

    @GetMapping("/medicamento/{medicamentoId}")
    public List<RegistroTomada> listarPorMedicamento(@PathVariable Long medicamentoId) {
        return service.listarPorMedicamento(medicamentoId);
    }
    @GetMapping("/usuario/{usuarioId}")
    public List<RegistroTomadaHistoricoDTO> listarPorUsuario(@PathVariable Long usuarioId) {
        return service.listarPorUsuario(usuarioId)
                .stream()
                .filter(RegistroTomada::isTomado)            // só registros tomados
                .map(RegistroTomadaHistoricoDTO::new)        // converte para DTO limpo
                .toList();
    }

    @DeleteMapping("/usuario/{usuarioId}")
    public ResponseEntity<Void> apagarHistorico(@PathVariable Long usuarioId) {
        service.apagarHistorico(usuarioId);
        return ResponseEntity.noContent().build();
    }

    // *** ESTE É O ENDPOINT QUE O FRONT CHAMA ***
    @PostMapping
    public ResponseEntity<Void> registrarTomadaDireto(@RequestParam Long horarioId) {
        service.registrarTomadaDireto(horarioId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/medicamento/{medicamentoId}/dia")
    public List<RegistroTomada> listarPorMedicamentoEDia(
            @PathVariable Long medicamentoId,
            @RequestParam("data")
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate data) {

        return service.listarPorMedicamentoEDia(medicamentoId, data);
    }

    @PatchMapping("/{id}/check")
    public ResponseEntity<RegistroTomada> marcarTomada(
            @PathVariable Long id,
            @RequestParam(required = false) Boolean tomado) {

        return ResponseEntity.ok(service.marcarTomada(id, tomado));
    }

    @PostMapping("/create")
    public ResponseEntity<RegistroTomada> criarRegistro(@RequestBody RegistroTomadaRegistroRequest request) {
        RegistroTomada salvo = service.criarRegistro(
                request.getMedicamentoId(),
                request.getHorarioId(),
                request.getDataPrevista()
        );
        return ResponseEntity.ok(salvo);
    }

    // DTO
    public static class RegistroTomadaRegistroRequest {

        private Long medicamentoId;
        private Long horarioId;
        private LocalDate dataPrevista;

        public Long getMedicamentoId() { return medicamentoId; }
        public void setMedicamentoId(Long medicamentoId) { this.medicamentoId = medicamentoId; }

        public Long getHorarioId() { return horarioId; }
        public void setHorarioId(Long horarioId) { this.horarioId = horarioId; }

        public LocalDate getDataPrevista() { return dataPrevista; }
        public void setDataPrevista(LocalDate dataPrevista) { this.dataPrevista = dataPrevista; }
    }
}
