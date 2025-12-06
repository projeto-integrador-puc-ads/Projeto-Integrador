package br.pucgo.ads.projetointegrador.plataforma.service.impl;

import br.pucgo.ads.projetointegrador.plataforma.dto.PermissionResponseDto;
import br.pucgo.ads.projetointegrador.plataforma.dto.RoleDto;
import br.pucgo.ads.projetointegrador.plataforma.dto.RoleResponseDto;
import br.pucgo.ads.projetointegrador.plataforma.entity.Role;
import br.pucgo.ads.projetointegrador.plataforma.exception.RoleNotFoundException;
import br.pucgo.ads.projetointegrador.plataforma.repository.RoleRepository;
import br.pucgo.ads.projetointegrador.plataforma.service.RoleService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RoleServiceImpl implements RoleService {

	private final RoleRepository roleRepository;

	@Override
	public Role findByName(String name) {
		return roleRepository.findByName(name)
				.orElseThrow(() -> new RoleNotFoundException("Role não encontrada: " + name));
	}

	@Override
	@Transactional(readOnly = true)
	public List<RoleResponseDto> getAllRoles() {
		return roleRepository.findAll().stream()
				.map(this::convertToDto)
				.collect(Collectors.toList());
	}

	@Override
	@Transactional(readOnly = true)
	public RoleResponseDto getRoleById(Long id) {
		Role role = roleRepository.findById(id)
				.orElseThrow(() -> new RoleNotFoundException("Role não encontrada com ID: " + id));
		return convertToDto(role);
	}

	@Override
	@Transactional
	public RoleResponseDto createRole(RoleDto roleDto) {
		Role role = new Role();
		role.setName(roleDto.getName());
		role.setCode(roleDto.getCode());
		role.setScope(roleDto.getScope());
		Role savedRole = roleRepository.save(role);
		return convertToDto(savedRole);
	}

	@Override
	@Transactional
	public RoleResponseDto updateRole(Long id, RoleDto roleDto) {
		Role role = roleRepository.findById(id)
				.orElseThrow(() -> new RoleNotFoundException("Role não encontrada com ID: " + id));
		role.setName(roleDto.getName());
		role.setCode(roleDto.getCode());
		role.setScope(roleDto.getScope());
		Role savedRole = roleRepository.save(role);
		return convertToDto(savedRole);
	}

	@Override
	@Transactional
	public void deleteRole(Long id) {
		Role role = roleRepository.findById(id)
				.orElseThrow(() -> new RoleNotFoundException("Role não encontrada com ID: " + id));
		roleRepository.delete(role);
	}

	private RoleResponseDto convertToDto(Role role) {
		RoleResponseDto dto = new RoleResponseDto();
		dto.setId(role.getId());
		dto.setCode(role.getCode());
		dto.setName(role.getName());
		dto.setScope(role.getScope());
		dto.setCreatedAt(role.getCreatedAt());

		// Converter permissões para DTOs FIX LAZY LOADING
		if (role.getPermissions() != null) {
			List<PermissionResponseDto> permissionDtos = role.getPermissions().stream()
					.map(permission -> {
						PermissionResponseDto permDto = new PermissionResponseDto();
						permDto.setId(permission.getId());
						permDto.setName(permission.getName());
						permDto.setCreatedAt(permission.getCreatedAt());
						if (permission.getModule() != null) {
							permDto.setModuleId(permission.getModule().getId());
							permDto.setModuleName(permission.getModule().getName());
						}
						return permDto;
					})
					.collect(Collectors.toList());
			dto.setPermissions(permissionDtos);
		}

		return dto;
	}

}
