package br.pucgo.ads.projetointegrador.carekeeper.config.seed;

import br.pucgo.ads.projetointegrador.plataforma.entity.User;
import br.pucgo.ads.projetointegrador.plataforma.repository.UserRepository;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.core.annotation.Order;

import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.Arrays;
import java.util.List;

/**
 * Popula a tabela "users" com usuários padrão em ambiente de desenvolvimento.
 */
@Order(1)
@Profile("dev")
public class DevUserSeeder implements ApplicationRunner {

    private final UserRepository userRepository;

    public DevUserSeeder(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    @SuppressWarnings("null")
    public void run(ApplicationArguments args) {
        List<User> usersToSeed = Arrays.asList(
            createUser(1L, "Usuário Demo", "demo@carekeeper.com", "+55 11 99999-9999", LocalDate.of(1990,1,1), "https://example.com/photo.jpg"),
            createUser(2L, "João Silva", "joao@carekeeper.com", "+55 11 98888-8888", LocalDate.of(1985,5,20), "https://example.com/joao.jpg"),
            createUser(3L, "Maria Souza", "maria@carekeeper.com", "+55 21 97777-7777", LocalDate.of(1992,8,15), "https://example.com/maria.jpg"),
            createUser(4L, "Carlos Oliveira", "carlos@carekeeper.com", "+55 31 96666-6666", LocalDate.of(1988,3,10), "https://example.com/carlos.jpg")
        );

        for (User user : usersToSeed) {
            if (userRepository.findById(user.getId()).isEmpty()) {
                userRepository.save(user);
            } 
        }
    }

    private User createUser(Long idLong, String name, String email, String phone, LocalDate birthDate, String photoUrl) {
        User user = new User();
        user.setName(name);
        user.setEmail(email);
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
