package com.example.carekeeper.service;

import com.example.carekeeper.model.ContactEmailEntity;
import com.example.carekeeper.model.UserEntity;
import com.example.carekeeper.repository.ContactEmailRepository;
import com.example.carekeeper.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

/**
 * Serviço responsável por operações relacionadas aos e-mails de contato dos usuários.
 */
@Service
public class ContactEmailService {

    private final ContactEmailRepository contactEmailRepository;
    private final UserRepository userRepository;

    public ContactEmailService(ContactEmailRepository contactEmailRepository, UserRepository userRepository) {
        this.contactEmailRepository = contactEmailRepository;
        this.userRepository = userRepository;
    }

    /**
     * Retorna todos os contatos associados a um usuário.
     *
     * @param userId ID do usuário dono dos contatos.
     * @return Lista de contatos do usuário.
     */
    public List<ContactEmailEntity> getContactsByUserId(UUID userId) {
        return contactEmailRepository.findByOwnerId(userId);
    }

    /**
     * Retorna um contato específico pelo ID.
     *
     * @param contactId ID do contato.
     * @return Contato encontrado ou lança exceção se não existir.
     */
    public ContactEmailEntity getById(UUID contactId) {
        return contactEmailRepository.findById(contactId)
                .orElseThrow(() -> new IllegalArgumentException("Contato não encontrado: " + contactId));
    }

    /**
     * Cria um novo contato de e-mail para um usuário.
     *
     * @param userId ID do usuário dono do contato.
     * @param contact Contato a ser criado.
     * @return Contato criado.
     */
    public ContactEmailEntity create(UUID userId, ContactEmailEntity contact) {
        UserEntity owner = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado: " + userId));
        contact.setOwner(owner);
        return contactEmailRepository.save(contact);
    }

    /**
     * Atualiza um contato existente.
     *
     * @param contactId ID do contato a ser atualizado.
     * @param updatedContact Dados atualizados do contato.
     * @return Contato atualizado.
     */
    public ContactEmailEntity update(UUID contactId, ContactEmailEntity updatedContact) {
        return contactEmailRepository.findById(contactId)
                .map(existing -> {
                    existing.setEmail(updatedContact.getEmail());
                    existing.setName(updatedContact.getName());
                    return contactEmailRepository.save(existing);
                })
                .orElseThrow(() -> new IllegalArgumentException("Contato não encontrado: " + contactId));
    }

    /**
     * Remove um contato pelo ID.
     *
     * @param contactId ID do contato a ser removido.
     */
    public void delete(UUID contactId) {
        if (!contactEmailRepository.existsById(contactId)) {
            throw new IllegalArgumentException("Contato não encontrado: " + contactId);
        }
        contactEmailRepository.deleteById(contactId);
    }
}
