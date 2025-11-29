package br.pucgo.ads.projetointegrador.carekeeper.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import br.pucgo.ads.projetointegrador.carekeeper.entity.ContactEmailEntity;

import java.util.List;

public interface ContactEmailRepository extends JpaRepository<ContactEmailEntity, Long> {
    List<ContactEmailEntity> findByOwnerId(Long ownerId);
}
