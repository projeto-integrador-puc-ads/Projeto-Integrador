package br.pucgo.ads.projetointegrador.plataforma.service.impl;

import br.pucgo.ads.projetointegrador.plataforma.dto.RoleDto;
import br.pucgo.ads.projetointegrador.plataforma.dto.UserProfileDto;
import br.pucgo.ads.projetointegrador.plataforma.dto.UserResponseDto;
import br.pucgo.ads.projetointegrador.plataforma.entity.Role;
import br.pucgo.ads.projetointegrador.plataforma.entity.User;
import br.pucgo.ads.projetointegrador.plataforma.exception.UserNotFoundException;
import br.pucgo.ads.projetointegrador.plataforma.repository.RoleRepository;
import br.pucgo.ads.projetointegrador.plataforma.repository.UserRepository;
import br.pucgo.ads.projetointegrador.plataforma.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;

    @Override
    public UserResponseDto getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("Usuário não encontrado com ID: " + id));
        return convertToDto(user);
    }

    @Override
    public UserResponseDto getUserByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("Usuário não encontrado com email: " + email));
        return convertToDto(user);
    }

    @Override
    public List<UserResponseDto> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public UserResponseDto updateUser(Long id, UserProfileDto userDto) {

        User user = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("Usuário não encontrado com ID: " + id));

        if (userDto.getName() != null)
            user.setName(userDto.getName());

        if (userDto.getEmail() != null)
            user.setEmail(userDto.getEmail());

        if (userDto.getUsername() != null)
            user.setUsername(userDto.getUsername());

        if (userDto.getRoleId() != null) {
            Role role = roleRepository.findById(userDto.getRoleId())
                    .orElseThrow(() -> new UserNotFoundException("Role não encontrada: " + userDto.getRoleId()));
            user.setRole(role);
        }

        user.setCrm(userDto.getCrm());
        user.setCertificacao(userDto.getCertificacao());
        user.setExperiencia(userDto.getExperiencia());

        User savedUser = userRepository.save(user);
        return convertToDto(savedUser);
    }

    @Override
    @Transactional
    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("Usuário não encontrado com ID: " + id));
        userRepository.delete(user);
    }

    @Override
    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    private UserResponseDto convertToDto(User user) {
        UserResponseDto dto = new UserResponseDto();
        dto.setId(user.getId());
        dto.setName(user.getName());
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        dto.setCrm(user.getCrm());
        dto.setCertificacao(user.getCertificacao());
        dto.setExperiencia(user.getExperiencia());
        dto.setPhone(user.getPhone());
        dto.setBirthDate(user.getBirthDate());
        dto.setPhotoUrl(user.getPhotoUrl());
        dto.setStatus(user.getStatus());
        dto.setCreatedAt(user.getCreatedAt());
        dto.setUpdatedAt(user.getUpdatedAt());

        // Converter Role para RoleDto FIX LAZY LOADING
        if (user.getRole() != null) {
            RoleDto roleDto = new RoleDto();
            roleDto.setId(user.getRole().getId());
            roleDto.setCode(user.getRole().getCode());
            roleDto.setName(user.getRole().getName());
            roleDto.setScope(user.getRole().getScope());
            dto.setRole(roleDto);
        }

        return dto;
    }
}