package br.pucgo.ads.projetointegrador.plataforma.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import br.pucgo.ads.projetointegrador.plataforma.entity.User;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    Boolean existsByUsername(String username);
    Boolean existsByEmail(String email);
    Optional<User> findByUsernameOrEmail(String username, String email);

    // Query otimizada: carrega User + Role + Permissions do Role + Permissions do User em uma única query
    @Query("SELECT DISTINCT u FROM User u " +
           "LEFT JOIN FETCH u.role r " +
           "LEFT JOIN FETCH r.permissions rp " +
           "LEFT JOIN FETCH u.permissions up " +
           "WHERE u.username = :username OR u.email = :username")
    Optional<User> findByUsernameOrEmailWithPermissions(@Param("username") String username);
}