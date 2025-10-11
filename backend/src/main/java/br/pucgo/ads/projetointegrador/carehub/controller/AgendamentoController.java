package br.pucgo.ads.projetointegrador.carehub.controller;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import br.pucgo.ads.projetointegrador.carehub.dto.agendamento.AgendamentoRequestDTO;
import br.pucgo.ads.projetointegrador.carehub.dto.agendamento.AgendamentoResponseDTO;
import br.pucgo.ads.projetointegrador.carehub.service.AgendamentoService;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/carehub/agendamentos")
@CrossOrigin(origins = "*")
public class AgendamentoController {

    @Autowired
    private AgendamentoService agendamentoService;

    @PostMapping
    public ResponseEntity<AgendamentoResponseDTO> criarAgendamento(
            @Valid @RequestBody AgendamentoRequestDTO dto
    ) {
        AgendamentoResponseDTO agendamento = agendamentoService.criarAgendamento(dto);
        return ResponseEntity.ok(agendamento);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<AgendamentoResponseDTO> atualizarStatus(
            @PathVariable Long id,
            @RequestParam String status
    ) {
        AgendamentoResponseDTO agendamento = agendamentoService.atualizarStatus(id, status);
        return ResponseEntity.ok(agendamento);
    }

    @GetMapping("/cuidador/{cuidadorId}")
    public ResponseEntity<List<AgendamentoResponseDTO>> listarPorCuidador(@PathVariable Long cuidadorId) {
        List<AgendamentoResponseDTO> agendamentos = agendamentoService.listarPorCuidador(cuidadorId);
        return ResponseEntity.ok(agendamentos);
    }

    @GetMapping("/cliente/{clienteId}")
    public ResponseEntity<List<AgendamentoResponseDTO>> listarPorCliente(@PathVariable Long clienteId) {
        List<AgendamentoResponseDTO> agendamentos = agendamentoService.listarPorCliente(clienteId);
        return ResponseEntity.ok(agendamentos);
    }

    @GetMapping("/cuidador/{cuidadorId}/periodo")
    public ResponseEntity<List<AgendamentoResponseDTO>> listarPorCuidadorEPeriodo(
            @PathVariable Long cuidadorId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime inicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fim
    ) {
        List<AgendamentoResponseDTO> agendamentos = agendamentoService.listarPorCuidadorEPeriodo(cuidadorId, inicio, fim);
        return ResponseEntity.ok(agendamentos);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> cancelarAgendamento(@PathVariable Long id) {
        agendamentoService.cancelarAgendamento(id);
        return ResponseEntity.noContent().build();
    }
}
