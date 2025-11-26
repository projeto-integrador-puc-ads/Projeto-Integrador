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
// administration is handled by plataforma; allow clients/family and caregivers appropriate access
@PreAuthorize("hasRole('IDOSO') or hasRole('FAMILIAR') or hasRole('CUIDADOR')")
public class ClienteController {

    @Autowired
    private ClienteService clienteService;

    @GetMapping
    // listing all clients should be restricted to caregivers (or platform admins managed outside)
    @PreAuthorize("hasRole('CUIDADOR')")
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
    @PreAuthorize("hasRole('CUIDADOR')")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        clienteService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
