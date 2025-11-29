package com.example.carekeeper.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;
import com.fasterxml.jackson.annotation.JsonBackReference;

/**
 * Representa um endereço de e-mail de contato associado a um usuário.
 * O contato pode ou não pertencer a um usuário real do sistema.
 */
@Entity
@Table(name = "contact_email")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ContactEmailEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(nullable = false)
    private String email;

    private String name;

    /**
     * Usuário dono dessa lista de contatos.
     */
    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "owner_user_id", nullable = false)
    private UserEntity owner;
}
