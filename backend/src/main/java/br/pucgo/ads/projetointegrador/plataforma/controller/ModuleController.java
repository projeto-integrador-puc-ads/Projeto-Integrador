package br.pucgo.ads.projetointegrador.plataforma.controller;

import br.pucgo.ads.projetointegrador.plataforma.dto.ModuleResponseDto;
import br.pucgo.ads.projetointegrador.plataforma.entity.Module;
import br.pucgo.ads.projetointegrador.plataforma.repository.ModuleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/modules")
@RequiredArgsConstructor
public class ModuleController {

    private final ModuleRepository moduleRepository;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ModuleResponseDto>> listarTodos() {
        List<ModuleResponseDto> modules = moduleRepository.findAll().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(modules);
    }

    private ModuleResponseDto toDto(Module module) {
        ModuleResponseDto dto = new ModuleResponseDto();
        dto.setId(module.getId());
        dto.setCode(module.getCode());
        dto.setName(module.getName());
        dto.setCreatedAt(module.getCreatedAt());
        return dto;
    }
}
