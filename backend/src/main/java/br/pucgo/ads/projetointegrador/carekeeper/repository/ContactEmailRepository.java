package com.example.carekeeper.repository;

import com.example.carekeeper.model.ContactEmailEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface ContactEmailRepository extends JpaRepository<ContactEmailEntity, UUID> {
    List<ContactEmailEntity> findByOwnerId(UUID ownerId);
}
