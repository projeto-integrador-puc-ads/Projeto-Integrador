package br.pucgo.ads.projetointegrador.plataforma.service;

import br.pucgo.ads.projetointegrador.plataforma.dto.PermissionRequestDto;
import br.pucgo.ads.projetointegrador.plataforma.dto.PermissionResponseDto;

import java.util.List;

public interface PermissionService {
    PermissionResponseDto createPermission(PermissionRequestDto permissionDto);
    PermissionResponseDto getPermissionById(Long id);
    PermissionResponseDto getPermissionByName(String name);
    List<PermissionResponseDto> getAllPermissions();
    List<PermissionResponseDto> getPermissionsByModuleId(Long moduleId);
    PermissionResponseDto updatePermission(Long id, PermissionRequestDto permissionDto);
    void deletePermission(Long id);
    boolean existsByName(String name);
}
