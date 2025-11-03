package br.pucgo.ads.projetointegrador.plataforma.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import br.pucgo.ads.projetointegrador.plataforma.entity.User;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    Boolean existsByUsername(String username);
    Boolean existsByEmail(String email);
    Optional<User> findByUsernameOrEmail(String username, String email);
}