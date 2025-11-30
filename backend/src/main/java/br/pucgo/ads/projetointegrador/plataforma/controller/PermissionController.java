package br.pucgo.ads.projetointegrador.plataforma.controller;

import br.pucgo.ads.projetointegrador.plataforma.dto.PermissionRequestDto;
import br.pucgo.ads.projetointegrador.plataforma.dto.PermissionResponseDto;
import br.pucgo.ads.projetointegrador.plataforma.service.PermissionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/permissions")
@RequiredArgsConstructor
public class PermissionController {

    private final PermissionService permissionService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PermissionResponseDto> createPermission(@RequestBody PermissionRequestDto permissionDto) {
        PermissionResponseDto createdPermission = permissionService.createPermission(permissionDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdPermission);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PermissionResponseDto> getPermissionById(@PathVariable Long id) {
        return ResponseEntity.ok(permissionService.getPermissionById(id));
    }

    @GetMapping("/name/{name}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PermissionResponseDto> getPermissionByName(@PathVariable String name) {
        return ResponseEntity.ok(permissionService.getPermissionByName(name));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<PermissionResponseDto>> getAllPermissions() {
        return ResponseEntity.ok(permissionService.getAllPermissions());
    }

    @GetMapping("/module/{moduleId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<PermissionResponseDto>> getPermissionsByModuleId(@PathVariable Long moduleId) {
        return ResponseEntity.ok(permissionService.getPermissionsByModuleId(moduleId));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PermissionResponseDto> updatePermission(
            @PathVariable Long id,
            @RequestBody PermissionRequestDto permissionDto) {
        return ResponseEntity.ok(permissionService.updatePermission(id, permissionDto));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deletePermission(@PathVariable Long id) {
        permissionService.deletePermission(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/exists/{name}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Boolean> existsByName(@PathVariable String name) {
        return ResponseEntity.ok(permissionService.existsByName(name));
    }
}
