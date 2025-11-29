package com.example.carekeeper.repository;

import com.example.carekeeper.model.ConfigurationEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface ConfigurationRepository extends JpaRepository<ConfigurationEntity, Long> {
    Optional<ConfigurationEntity> findByUserId(UUID userId);
}
