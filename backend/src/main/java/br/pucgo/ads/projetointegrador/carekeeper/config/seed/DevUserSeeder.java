package com.example.carekeeper.config.seed;

import com.example.carekeeper.model.UserEntity;
import com.example.carekeeper.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

/**
 * Popula a tabela "users" com usuários padrão em ambiente de desenvolvimento.
 */
@Component
@Order(1)
@Profile("dev")
public class DevUserSeeder implements ApplicationRunner {

    private static final Logger log = LoggerFactory.getLogger(DevUserSeeder.class);
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public DevUserSeeder(UserRepository userRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = new BCryptPasswordEncoder();
    }

    @Override
    public void run(ApplicationArguments args) {
        List<UserEntity> usersToSeed = Arrays.asList(
            createUser("00000000-0000-0000-0000-000000000001", "Usuário Demo", "demo@carekeeper.com", "+55 11 99999-9999", LocalDate.of(1990,1,1), "https://example.com/photo.jpg"),
            createUser("00000000-0000-0000-0000-000000000002", "João Silva", "joao@carekeeper.com", "+55 11 98888-8888", LocalDate.of(1985,5,20), "https://example.com/joao.jpg"),
            createUser("00000000-0000-0000-0000-000000000003", "Maria Souza", "maria@carekeeper.com", "+55 21 97777-7777", LocalDate.of(1992,8,15), "https://example.com/maria.jpg"),
            createUser("00000000-0000-0000-0000-000000000004", "Carlos Oliveira", "carlos@carekeeper.com", "+55 31 96666-6666", LocalDate.of(1988,3,10), "https://example.com/carlos.jpg")
        );

        for (UserEntity user : usersToSeed) {
            if (userRepository.findById(user.getId()).isEmpty()) {
                userRepository.save(user);
                log.info("DevUserSeeder: usuário criado com sucesso (id={}, nome={})", user.getId(), user.getName());
            } else {
                log.info("DevUserSeeder: usuário já existe (id={}, nome={})", user.getId(), user.getName());
            }
        }
    }

    private UserEntity createUser(String idStr, String name, String email, String phone, LocalDate birthDate, String photoUrl) {
        UserEntity user = new UserEntity();
        user.setId(UUID.fromString(idStr));
        user.setName(name);
        user.setEmail(email);
        user.setPasswordHash(passwordEncoder.encode("senha123"));
        user.setPhone(phone);
        user.setBirthDate(birthDate);
        user.setPhotoUrl(photoUrl);
        user.setStatus("ACTIVE");
        user.setCreatedAt(OffsetDateTime.now());
        user.setUpdatedAt(OffsetDateTime.now());
        user.setDeletedAt(null);
        return user;
    }
}
