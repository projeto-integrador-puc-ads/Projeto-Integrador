package br.pucgo.ads.projetointegrador.plataforma.config;

import br.pucgo.ads.projetointegrador.plataforma.entity.Permission;
import br.pucgo.ads.projetointegrador.plataforma.entity.Role;
import br.pucgo.ads.projetointegrador.plataforma.entity.User;
import br.pucgo.ads.projetointegrador.plataforma.repository.PermissionRepository;
import br.pucgo.ads.projetointegrador.plataforma.repository.RoleRepository;
import br.pucgo.ads.projetointegrador.plataforma.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Arrays;
import java.util.HashSet;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initData(RoleRepository roleRepository,
            UserRepository userRepository,
            PermissionRepository permissionRepository,
            PasswordEncoder passwordEncoder) {
        return args -> {

            // ==================== PASSO 1: Criar Permissões ====================
            System.out.println("Inicializando permissões...");

            Permission createPermission = permissionRepository.findByName("CREATE")
                    .orElseGet(() -> {
                        Permission p = new Permission();
                        p.setName("CREATE");
                        return permissionRepository.save(p);
                    });

            Permission readPermission = permissionRepository.findByName("READ")
                    .orElseGet(() -> {
                        Permission p = new Permission();
                        p.setName("READ");
                        return permissionRepository.save(p);
                    });

            Permission updatePermission = permissionRepository.findByName("UPDATE")
                    .orElseGet(() -> {
                        Permission p = new Permission();
                        p.setName("UPDATE");
                        return permissionRepository.save(p);
                    });

            Permission deletePermission = permissionRepository.findByName("DELETE")
                    .orElseGet(() -> {
                        Permission p = new Permission();
                        p.setName("DELETE");
                        return permissionRepository.save(p);
                    });

            Permission manageUsersPermission = permissionRepository.findByName("MANAGE_USERS")
                    .orElseGet(() -> {
                        Permission p = new Permission();
                        p.setName("MANAGE_USERS");
                        return permissionRepository.save(p);
                    });

            Permission manageRolesPermission = permissionRepository.findByName("MANAGE_ROLES")
                    .orElseGet(() -> {
                        Permission p = new Permission();
                        p.setName("MANAGE_ROLES");
                        return permissionRepository.save(p);
                    });

            System.out.println("Permissões criadas com sucesso!");

            // ==================== PASSO 2: Criar Roles com Permissões ====================
            System.out.println("Inicializando roles...");

            // ROLE_ADMIN - Administrador do sistema
            Role adminRole = roleRepository.findByName("ROLE_ADMIN")
                    .orElseGet(() -> {
                        Role newRole = new Role();
                        newRole.setCode("ADMIN");
                        newRole.setName("ROLE_ADMIN");
                        newRole.setScope("GLOBAL");

                        // Admin tem TODAS as permissões
                        newRole.setPermissions(new HashSet<>(Arrays.asList(
                                createPermission,
                                readPermission,
                                updatePermission,
                                deletePermission,
                                manageUsersPermission,
                                manageRolesPermission)));

                        return roleRepository.save(newRole);
                    });

            // ROLE_IDOSO - Usuário idoso
            Role idosoRole = roleRepository.findByName("ROLE_IDOSO")
                    .orElseGet(() -> {
                        Role newRole = new Role();
                        newRole.setCode("IDOSO");
                        newRole.setName("ROLE_IDOSO");
                        newRole.setScope("LIMITED");

                        // Idoso tem permissão de leitura e atualização (próprio perfil)
                        newRole.setPermissions(new HashSet<>(Arrays.asList(
                                readPermission,
                                updatePermission)));

                        return roleRepository.save(newRole);
                    });

            // ROLE_CUIDADOR - Cuidador profissional
            Role cuidadorRole = roleRepository.findByName("ROLE_CUIDADOR")
                    .orElseGet(() -> {
                        Role newRole = new Role();
                        newRole.setCode("CUIDADOR");
                        newRole.setName("ROLE_CUIDADOR");
                        newRole.setScope("LIMITED");

                        // Cuidador tem permissões de leitura e atualização
                        newRole.setPermissions(new HashSet<>(Arrays.asList(
                                readPermission,
                                updatePermission)));

                        return roleRepository.save(newRole);
                    });

            // ROLE_MEDICO - Médico
            Role medicoRole = roleRepository.findByName("ROLE_MEDICO")
                    .orElseGet(() -> {
                        Role newRole = new Role();
                        newRole.setCode("MEDICO");
                        newRole.setName("ROLE_MEDICO");
                        newRole.setScope("LIMITED");

                        // Médico tem permissões de leitura, criação e atualização
                        newRole.setPermissions(new HashSet<>(Arrays.asList(
                                createPermission,
                                readPermission,
                                updatePermission)));

                        return roleRepository.save(newRole);
                    });

            System.out.println("Roles criadas com sucesso!");

            // ==================== PASSO 3: Criar usuários de teste ====================

            // Criar usuário admin
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

            // Criar usuário idoso de teste
            if (!userRepository.existsByUsername("idoso")) {
                User idoso = new User();
                idoso.setName("João Silva Santos");
                idoso.setUsername("idoso");
                idoso.setEmail("joao.silva@email.com");
                idoso.setPassword(passwordEncoder.encode("123456"));
                idoso.setRole(idosoRole);

                userRepository.save(idoso);
                System.out.println("Usuário idoso criado com sucesso!");
            } else {
                System.out.println("Usuário idoso já existe. Nenhuma ação necessária.");
            }
        };
    }
}
