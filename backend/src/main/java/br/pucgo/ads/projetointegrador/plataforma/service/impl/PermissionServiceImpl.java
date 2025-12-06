package br.pucgo.ads.projetointegrador.plataforma.service.impl;

import br.pucgo.ads.projetointegrador.plataforma.dto.PermissionRequestDto;
import br.pucgo.ads.projetointegrador.plataforma.dto.PermissionResponseDto;
import br.pucgo.ads.projetointegrador.plataforma.entity.Module;
import br.pucgo.ads.projetointegrador.plataforma.entity.Permission;
import br.pucgo.ads.projetointegrador.plataforma.repository.ModuleRepository;
import br.pucgo.ads.projetointegrador.plataforma.repository.PermissionRepository;
import br.pucgo.ads.projetointegrador.plataforma.service.PermissionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PermissionServiceImpl implements PermissionService {

    private final PermissionRepository permissionRepository;
    private final ModuleRepository moduleRepository;

    @Override
    @Transactional
    public PermissionResponseDto createPermission(PermissionRequestDto permissionDto) {
        if (permissionRepository.existsByName(permissionDto.getName())) {
            throw new IllegalArgumentException("Permissão com este nome já existe: " + permissionDto.getName());
        }

        Permission permission = new Permission();
        permission.setName(permissionDto.getName());

        if (permissionDto.getModuleId() != null) {
            Module module = moduleRepository.findById(permissionDto.getModuleId())
                    .orElseThrow(() -> new IllegalArgumentException("Módulo não encontrado: " + permissionDto.getModuleId()));
            permission.setModule(module);
        }

        Permission savedPermission = permissionRepository.save(permission);
        return mapToResponseDto(savedPermission);
    }

    @Override
    public PermissionResponseDto getPermissionById(Long id) {
        Permission permission = permissionRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Permissão não encontrada com ID: " + id));
        return mapToResponseDto(permission);
    }

    @Override
    public PermissionResponseDto getPermissionByName(String name) {
        Permission permission = permissionRepository.findByName(name)
                .orElseThrow(() -> new IllegalArgumentException("Permissão não encontrada com nome: " + name));
        return mapToResponseDto(permission);
    }

    @Override
    public List<PermissionResponseDto> getAllPermissions() {
        return permissionRepository.findAll().stream()
                .map(this::mapToResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<PermissionResponseDto> getPermissionsByModuleId(Long moduleId) {
        return permissionRepository.findByModuleId(moduleId).stream()
                .map(this::mapToResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public PermissionResponseDto updatePermission(Long id, PermissionRequestDto permissionDto) {
        Permission permission = permissionRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Permissão não encontrada com ID: " + id));

        if (permissionDto.getName() != null && !permissionDto.getName().equals(permission.getName())) {
            if (permissionRepository.existsByName(permissionDto.getName())) {
                throw new IllegalArgumentException("Permissão com este nome já existe: " + permissionDto.getName());
            }
            permission.setName(permissionDto.getName());
        }

        if (permissionDto.getModuleId() != null) {
            Module module = moduleRepository.findById(permissionDto.getModuleId())
                    .orElseThrow(() -> new IllegalArgumentException("Módulo não encontrado: " + permissionDto.getModuleId()));
            permission.setModule(module);
        } else {
            permission.setModule(null);
        }

        Permission updatedPermission = permissionRepository.save(permission);
        return mapToResponseDto(updatedPermission);
    }

    @Override
    @Transactional
    public void deletePermission(Long id) {
        Permission permission = permissionRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Permissão não encontrada com ID: " + id));
        permissionRepository.delete(permission);
    }

    @Override
    public boolean existsByName(String name) {
        return permissionRepository.existsByName(name);
    }

    private PermissionResponseDto mapToResponseDto(Permission permission) {
        PermissionResponseDto dto = new PermissionResponseDto();
        dto.setId(permission.getId());
        dto.setName(permission.getName());
        dto.setCreatedAt(permission.getCreatedAt());
        
        if (permission.getModule() != null) {
            dto.setModuleId(permission.getModule().getId());
            dto.setModuleName(permission.getModule().getName());
        }
        
        return dto;
    }
}
