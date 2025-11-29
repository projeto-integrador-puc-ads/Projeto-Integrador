package com.example.carekeeper.controller;

import com.example.carekeeper.model.ContactEmailEntity;
import com.example.carekeeper.service.ContactEmailService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

/**
 * Controller para gerenciar os e-mails de contato dos usuários.
 */
@RestController
@RequestMapping("/api/contact-emails")
public class ContactEmailController {

    private final ContactEmailService contactEmailService;

    public ContactEmailController(ContactEmailService contactEmailService) {
        this.contactEmailService = contactEmailService;
    }

    /**
     * Retorna todos os contatos de um usuário.
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ContactEmailEntity>> getContactsByUser(@PathVariable UUID userId) {
        List<ContactEmailEntity> contacts = contactEmailService.getContactsByUserId(userId);
        return ResponseEntity.ok(contacts);
    }

    /**
     * Retorna um contato específico pelo ID.
     */
    @GetMapping("/{contactId}")
    public ResponseEntity<ContactEmailEntity> getContactById(@PathVariable UUID contactId) {
        ContactEmailEntity contact = contactEmailService.getById(contactId);
        return ResponseEntity.ok(contact);
    }

    /**
     * Cria um novo contato para o usuário.
     */
    @PostMapping("/user/{userId}")
    public ResponseEntity<ContactEmailEntity> createContact(
            @PathVariable UUID userId,
            @RequestBody ContactEmailEntity contact) {
        ContactEmailEntity created = contactEmailService.create(userId, contact);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    /**
     * Atualiza um contato existente.
     */
    @PutMapping("/{contactId}")
    public ResponseEntity<ContactEmailEntity> updateContact(
            @PathVariable UUID contactId,
            @RequestBody ContactEmailEntity contact) {
        ContactEmailEntity updated = contactEmailService.update(contactId, contact);
        return ResponseEntity.ok(updated);
    }

    /**
     * Deleta um contato pelo ID.
     */
    @DeleteMapping("/{contactId}")
    public ResponseEntity<Void> deleteContact(@PathVariable UUID contactId) {
        contactEmailService.delete(contactId);
        return ResponseEntity.noContent().build();
    }
}
