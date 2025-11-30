package br.pucgo.ads.projetointegrador.plataforma.service;

import br.pucgo.ads.projetointegrador.plataforma.dto.RoleDto;
import br.pucgo.ads.projetointegrador.plataforma.dto.RoleResponseDto;
import br.pucgo.ads.projetointegrador.plataforma.entity.Role;

import java.util.List;

public interface RoleService {

    Role findByName(String name);

    List<RoleResponseDto> getAllRoles();

    RoleResponseDto getRoleById(Long id);

    RoleResponseDto createRole(RoleDto roleDto);

    RoleResponseDto updateRole(Long id, RoleDto roleDto);

    void deleteRole(Long id);

}