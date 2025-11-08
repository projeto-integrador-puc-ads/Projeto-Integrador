package br.pucgo.ads.projetointegrador.carehub.controller;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import br.pucgo.ads.projetointegrador.carehub.dto.registro.RegistroAcompanhamentoRequestDTO;
import br.pucgo.ads.projetointegrador.carehub.dto.registro.RegistroAcompanhamentoResponseDTO;
import br.pucgo.ads.projetointegrador.carehub.service.RegistroAcompanhamentoService;

import java.util.List;

@RestController
@RequestMapping("/api/carehub/registros")
public class RegistroAcompanhamentoController {

    @Autowired
    private RegistroAcompanhamentoService registroService;

    @PostMapping
    public ResponseEntity<RegistroAcompanhamentoResponseDTO> criarRegistro(
            @RequestHeader("X-User-Id") Long cuidadorId,
            @Valid @RequestBody RegistroAcompanhamentoRequestDTO dto
    ) {
        RegistroAcompanhamentoResponseDTO registro = registroService.criarRegistro(cuidadorId, dto);
        return ResponseEntity.ok(registro);
    }

    @GetMapping("/cliente/{clienteId}")
    public ResponseEntity<List<RegistroAcompanhamentoResponseDTO>> listarPorCliente(@PathVariable Long clienteId) {
        List<RegistroAcompanhamentoResponseDTO> registros = registroService.listarPorCliente(clienteId);
        return ResponseEntity.ok(registros);
    }

    @GetMapping("/cuidador/{cuidadorId}")
    public ResponseEntity<List<RegistroAcompanhamentoResponseDTO>> listarPorCuidador(@PathVariable Long cuidadorId) {
        List<RegistroAcompanhamentoResponseDTO> registros = registroService.listarPorCuidador(cuidadorId);
        return ResponseEntity.ok(registros);
    }

    @GetMapping("/agendamento/{agendamentoId}")
    public ResponseEntity<List<RegistroAcompanhamentoResponseDTO>> listarPorAgendamento(@PathVariable Long agendamentoId) {
        List<RegistroAcompanhamentoResponseDTO> registros = registroService.listarPorAgendamento(agendamentoId);
        return ResponseEntity.ok(registros);
    }

    @GetMapping("/{id}")
    public ResponseEntity<RegistroAcompanhamentoResponseDTO> buscarPorId(@PathVariable Long id) {
        RegistroAcompanhamentoResponseDTO registro = registroService.buscarPorId(id);
        return ResponseEntity.ok(registro);
    }
}
