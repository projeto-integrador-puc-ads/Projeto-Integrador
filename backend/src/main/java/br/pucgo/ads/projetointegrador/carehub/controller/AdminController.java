package br.pucgo.ads.projetointegrador.carehub.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import br.pucgo.ads.projetointegrador.plataforma.entity.User;
import br.pucgo.ads.projetointegrador.carehub.service.AdminService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/carehub/admin")
@PreAuthorize("hasRole('ROLE_ADMIN')")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @GetMapping("/usuarios")
    public ResponseEntity<List<User>> listarTodosUsuarios() {
        List<User> usuarios = adminService.listarTodosUsuarios();
        return ResponseEntity.ok(usuarios);
    }

    @GetMapping("/usuarios/{id}")
    public ResponseEntity<User> buscarUsuarioPorId(@PathVariable Long id) {
        User usuario = adminService.buscarUsuarioPorId(id);
        return ResponseEntity.ok(usuario);
    }

    @PutMapping("/usuarios/{id}/status")
    public ResponseEntity<User> alterarStatusUsuario(
            @PathVariable Long id,
            @RequestBody Map<String, Boolean> status
    ) {
        User usuario = adminService.alterarStatusUsuario(id, status.get("ativo"));
        return ResponseEntity.ok(usuario);
    }

    @DeleteMapping("/usuarios/{id}")
    public ResponseEntity<Void> deletarUsuario(@PathVariable Long id) {
        adminService.deletarUsuario(id);
        return ResponseEntity.noContent().build();
    }
}
