package br.pucgo.ads.projetointegrador.plataforma.service.impl;

import br.pucgo.ads.projetointegrador.plataforma.dto.RoleDto;
import br.pucgo.ads.projetointegrador.plataforma.entity.Role;
import br.pucgo.ads.projetointegrador.plataforma.exception.RoleNotFoundException;
import br.pucgo.ads.projetointegrador.plataforma.repository.RoleRepository;
import br.pucgo.ads.projetointegrador.plataforma.service.RoleService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

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
	public List<Role> getAllRoles() {
		return roleRepository.findAll();
	}

	@Override
	public Role getRoleById(Long id) {
		return roleRepository.findById(id)
				.orElseThrow(() -> new RoleNotFoundException("Role não encontrada com ID: " + id));
	}

	@Override
	@Transactional
	public Role createRole(RoleDto roleDto) {
		Role role = new Role();
		role.setName(roleDto.getName());
		return roleRepository.save(role);
	}

	@Override
	@Transactional
	public Role updateRole(Long id, RoleDto roleDto) {
		Role role = getRoleById(id);
		role.setName(roleDto.getName());
		return roleRepository.save(role);
	}

	@Override
	@Transactional
	public void deleteRole(Long id) {
		Role role = getRoleById(id);
		roleRepository.delete(role);
	}

}

