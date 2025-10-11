package br.pucgo.ads.projetointegrador.carehub.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import br.pucgo.ads.projetointegrador.carehub.dto.cliente.ClienteRequestDTO;
import br.pucgo.ads.projetointegrador.carehub.dto.cliente.ClienteResponseDTO;
import br.pucgo.ads.projetointegrador.carehub.service.ClienteService;

import java.util.List;

@RestController
@RequestMapping("/api/carehub/clientes")
@CrossOrigin(origins = "*")
@PreAuthorize("hasRole('CLIENTE') or hasRole('ADMIN')")
public class ClienteController {

    @Autowired
    private ClienteService clienteService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ClienteResponseDTO>> listarTodos() {
        List<ClienteResponseDTO> clientes = clienteService.listarTodos();
        return ResponseEntity.ok(clientes);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ClienteResponseDTO> buscarPorId(@PathVariable Long id) {
        ClienteResponseDTO cliente = clienteService.buscarPorId(id);
        return ResponseEntity.ok(cliente);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ClienteResponseDTO> atualizar(
            @PathVariable Long id,
            @RequestBody ClienteRequestDTO dto
    ) {
        ClienteResponseDTO cliente = clienteService.atualizar(id, dto);
        return ResponseEntity.ok(cliente);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        clienteService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
