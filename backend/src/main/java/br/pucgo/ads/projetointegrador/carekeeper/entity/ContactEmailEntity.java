package br.pucgo.ads.projetointegrador.carekeeper.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import com.fasterxml.jackson.annotation.JsonBackReference;

import br.pucgo.ads.projetointegrador.plataforma.entity.User;

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
    private Long id;

    @Column(nullable = false)
    private String email;

    private String name;

    /**
     * Usuário dono dessa lista de contatos.
     */
    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "owner_user_id", nullable = false)
    private User owner;
    
    public ContactEmailEntity(String email, String name, User owner) {
        this.email = email;
        this.name = name;
        this.owner = owner;
    }
}
