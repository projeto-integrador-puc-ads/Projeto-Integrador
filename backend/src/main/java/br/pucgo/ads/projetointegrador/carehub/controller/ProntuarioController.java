package br.pucgo.ads.projetointegrador.carehub.controller;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import br.pucgo.ads.projetointegrador.carehub.dto.prontuario.ProntuarioRequestDTO;
import br.pucgo.ads.projetointegrador.carehub.dto.prontuario.ProntuarioResponseDTO;
import br.pucgo.ads.projetointegrador.carehub.exception.ForbiddenException;
import br.pucgo.ads.projetointegrador.carehub.service.AgendamentoService;
import br.pucgo.ads.projetointegrador.carehub.service.ProntuarioService;

import java.security.Principal;

@RestController
@RequestMapping("/api/carehub/prontuarios")
public class ProntuarioController {

    @Autowired
    private ProntuarioService prontuarioService;

    @Autowired
    private AgendamentoService agendamentoService;

    @PostMapping
    public ResponseEntity<ProntuarioResponseDTO> criarProntuario(
            @Valid @RequestBody ProntuarioRequestDTO dto
    ) {
        ProntuarioResponseDTO prontuario = prontuarioService.criarProntuario(dto);
        return ResponseEntity.ok(prontuario);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProntuarioResponseDTO> atualizarProntuario(
            @PathVariable Long id,
            Principal principal,
            @Valid @RequestBody ProntuarioRequestDTO dto
    ) {
        Long cuidadorId = Long.parseLong(principal.getName());
        
        // Buscar prontuário para obter o clienteId
        ProntuarioResponseDTO prontuarioAtual = prontuarioService.buscarPorId(id);
        Long clienteId = prontuarioAtual.getClienteId();
        
        // Validar se cuidador pode editar prontuário hoje
        if (!agendamentoService.podeEditarProntuario(cuidadorId, clienteId)) {
            throw new ForbiddenException(
                "Você só pode editar prontuários durante atendimentos agendados para hoje"
            );
        }
        
        ProntuarioResponseDTO prontuario = prontuarioService.atualizarProntuario(id, dto);
        return ResponseEntity.ok(prontuario);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProntuarioResponseDTO> buscarPorId(@PathVariable Long id) {
        ProntuarioResponseDTO prontuario = prontuarioService.buscarPorId(id);
        return ResponseEntity.ok(prontuario);
    }

    @GetMapping("/cliente/{clienteId}")
    public ResponseEntity<ProntuarioResponseDTO> buscarPorCliente(@PathVariable Long clienteId) {
        ProntuarioResponseDTO prontuario = prontuarioService.buscarPorClienteId(clienteId);
        return ResponseEntity.ok(prontuario);
    }

    @GetMapping("/pode-editar/{clienteId}")
    public ResponseEntity<Boolean> verificarPodeEditar(
            @PathVariable Long clienteId,
            Principal principal
    ) {
        Long cuidadorId = Long.parseLong(principal.getName());
        boolean podeEditar = agendamentoService.podeEditarProntuario(cuidadorId, clienteId);
        return ResponseEntity.ok(podeEditar);
    }
}
