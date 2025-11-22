package br.pucgo.ads.projetointegrador.plataforma.config;

import br.pucgo.ads.projetointegrador.plataforma.entity.Role;
import br.pucgo.ads.projetointegrador.plataforma.entity.User;
import br.pucgo.ads.projetointegrador.plataforma.repository.RoleRepository;
import br.pucgo.ads.projetointegrador.plataforma.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initData(RoleRepository roleRepository,
                               UserRepository userRepository,
                               PasswordEncoder passwordEncoder) {
        return args -> {

            // 1. Criar roles se não existirem
            Role adminRole = roleRepository.findByName("ROLE_ADMIN")
                    .orElseGet(() -> {
                        Role newRole = new Role();
                        newRole.setName("ROLE_ADMIN");
                        return roleRepository.save(newRole);
                    });

            Role userRole = roleRepository.findByName("ROLE_USER")
                    .orElseGet(() -> {
                        Role newRole = new Role();
                        newRole.setName("ROLE_USER");
                        return roleRepository.save(newRole);
                    });

            // 2. Criar usuário admin se não existir
            if (!userRepository.existsByUsername("admin")) {

                User admin = new User();
                admin.setName("Administrador Geral");
                admin.setUsername("admin");
                admin.setEmail("admin@system.com");
                admin.setPassword(passwordEncoder.encode("123456"));
                admin.setRole(adminRole);

                userRepository.save(admin);

                System.out.println("Administrador criado com sucesso!");
            } else {
                System.out.println("Usuário admin já existe. Nenhuma ação necessária.");
            }
        };
    }
}
