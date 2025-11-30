package br.pucgo.ads.projetointegrador.carekeeper.config.seed;

import br.pucgo.ads.projetointegrador.plataforma.entity.User;
import br.pucgo.ads.projetointegrador.carekeeper.entity.ContactEmailEntity;
import br.pucgo.ads.projetointegrador.carekeeper.repository.ContactEmailRepository;
import br.pucgo.ads.projetointegrador.plataforma.repository.UserRepository;

import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

/**
 * Cria contatos de exemplo no ambiente de desenvolvimento.
 *
 * Se o usuário padrão não existir, ele é criado.
 * Em seguida, adiciona alguns e-mails de contato associados a esse usuário.
 */
@Order(3)
@Profile("dev")
@Component
public class DevContactEmailSeeder implements ApplicationRunner {

    private final ContactEmailRepository contactRepo;
    private final UserRepository userRepo;

    public DevContactEmailSeeder(ContactEmailRepository contactRepo, UserRepository userRepo) {
        this.contactRepo = contactRepo;
        this.userRepo = userRepo;
    }

    @Override
    @SuppressWarnings("null")
    public void run(ApplicationArguments args) {
        Optional<User> optionalUser = userRepo.findByEmail("admin@system.com");

        if (optionalUser.isEmpty()) {
            return;
        }

        User user = optionalUser.get();

        List<ContactEmailEntity> contacts = List.of(
            new ContactEmailEntity("gabrielbarbosadev2022@gmail.com", "Gabriel Barbosa", user),
            new ContactEmailEntity("lovablel59011551@gmail.com", "Lovable", user),
            new ContactEmailEntity("20222012000046@pucgo.edu.br", "Gabriel Barbosa (PUC)", user)
        );

        contactRepo.saveAll(contacts);
    }

}
