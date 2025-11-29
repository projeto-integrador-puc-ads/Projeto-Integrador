package com.example.carekeeper.config.seed;

import com.example.carekeeper.model.ContactEmailEntity;
import com.example.carekeeper.model.UserEntity;
import com.example.carekeeper.repository.ContactEmailRepository;
import com.example.carekeeper.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;
import org.springframework.core.annotation.Order;

import java.time.OffsetDateTime;
import java.util.UUID;
import java.util.List;

/**
 * Cria contatos de exemplo no ambiente de desenvolvimento.
 *
 * Se o usuário padrão não existir, ele é criado.
 * Em seguida, adiciona alguns e-mails de contato associados a esse usuário.
 */
@Component
@Order(3)
@Profile("dev")
public class DevContactEmailSeeder implements ApplicationRunner {

    private static final Logger log = LoggerFactory.getLogger(DevContactEmailSeeder.class);
    private final ContactEmailRepository contactRepo;
    private final UserRepository userRepo;

    public DevContactEmailSeeder(ContactEmailRepository contactRepo, UserRepository userRepo) {
        this.contactRepo = contactRepo;
        this.userRepo = userRepo;
    }

    @Override
    public void run(ApplicationArguments args) {
        UUID userId = UUID.fromString("00000000-0000-0000-0000-000000000001");

        UserEntity user = userRepo.findById(userId).orElseGet(() -> {
            UserEntity newUser = new UserEntity();
            newUser.setId(userId);
            newUser.setName("Usuário Demo");
            newUser.setEmail("demo@carekeeper.com");
            newUser.setPasswordHash("hash_aqui");
            newUser.setCreatedAt(OffsetDateTime.now());
            newUser.setStatus("ACTIVE");
            return userRepo.save(newUser);
        });

        if (contactRepo.findByOwnerId(userId).isEmpty()) {
            List<ContactEmailEntity> contacts = List.of(
                new ContactEmailEntity(null, "gabrielbarbosadev2022@gmail.com", "Gabriel Barbosa", user),
                new ContactEmailEntity(null, "lovablel59011551@gmail.com", "Lovable", user),
                new ContactEmailEntity(null, "20222012000046@pucgo.edu.br", "Gabriel Barbosa (PUC)", user)
            );

            contactRepo.saveAll(contacts);
            log.info("DevContactEmailSeeder: contatos padrão criados para userId={}", userId);
        } else {
            log.info("DevContactEmailSeeder: contatos já existentes para userId={}", userId);
        }
    }
}
