package com.example.carekeeper.service;

import com.example.carekeeper.model.UserEntity;
import com.example.carekeeper.repository.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private static final Logger logger = LoggerFactory.getLogger(UserService.class);

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = new BCryptPasswordEncoder();
    }

    /**
     * Valida um usuário pelo email e senha.
     * Retorna o UserEntity se válido ou null se inválido.
     */
    public UserEntity validateUser(String email, String password) {
        logger.debug("Validando usuário com email: {}", email);

        Optional<UserEntity> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            logger.debug("Usuário não encontrado para email: {}", email);
            return null;
        }

        UserEntity user = userOpt.get();
        boolean passwordMatches = passwordEncoder.matches(password, user.getPasswordHash());
        if (!passwordMatches) {
            logger.debug("Senha incorreta para usuário: {}", email);
            return null;
        }

        logger.debug("Usuário validado com sucesso: {}", email);
        return user;
    }

    public List<UserEntity> getAllUsers() {
        return userRepository.findAll();
    }

    /**
     * Retorna um usuário pelo ID.
     */
    public UserEntity getUserById(UUID userId) {
        return userRepository.findById(userId).orElse(null);
    }

    
    public long getTotalUsers() {
        return userRepository.countAllUsers();
    }
}
