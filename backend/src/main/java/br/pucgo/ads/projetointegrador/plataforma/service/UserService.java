package br.pucgo.ads.projetointegrador.plataforma.service;

import br.pucgo.ads.projetointegrador.plataforma.dto.UserProfileDto;
import br.pucgo.ads.projetointegrador.plataforma.dto.UserResponseDto;
import java.util.List;

public interface UserService {
    UserResponseDto getUserById(Long id);
    UserResponseDto getUserByEmail(String email);
    List<UserResponseDto> getAllUsers();
    UserResponseDto updateUser(Long id, UserProfileDto userDto);
    void deleteUser(Long id);
    boolean existsByEmail(String email);
}