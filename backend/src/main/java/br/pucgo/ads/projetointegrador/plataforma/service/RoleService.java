package br.pucgo.ads.projetointegrador.plataforma.service;

import br.pucgo.ads.projetointegrador.plataforma.dto.RoleDto;
import br.pucgo.ads.projetointegrador.plataforma.entity.Role;

import java.util.List;

public interface RoleService {

    Role findByName(String name);

    List<Role> getAllRoles();

    Role getRoleById(Long id);

    Role createRole(RoleDto roleDto);

    Role updateRole(Long id, RoleDto roleDto);

    void deleteRole(Long id);

}