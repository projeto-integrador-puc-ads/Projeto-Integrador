package com.example.carekeeper.repository;

import com.example.carekeeper.model.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;

import java.util.UUID;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<UserEntity, UUID> {
    Optional<UserEntity> findByEmail(String email);
    boolean existsByEmail(String email);

    // Conta todos os usuários
    @Query("SELECT COUNT(u) FROM UserEntity u")
    long countAllUsers();
}
