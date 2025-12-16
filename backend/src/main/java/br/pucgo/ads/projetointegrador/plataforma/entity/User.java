package br.pucgo.ads.projetointegrador.plataforma.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.HashSet;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(nullable = false, unique = true)
    private String username;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(name = "password_hash", nullable = false)
    private String password;

    @ManyToOne
    @JoinColumn(name = "role_id", nullable = false)
    private Role role;

    @Column(nullable = true)
    private String crm;
    
    @Column(nullable = true)
    private String certificacao;
    
    @Column(nullable = true)
    private String experiencia;

    // Relacionamento N:N com Permission (NOVO MODELO NORMALIZADO)
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "user_permissions",
        joinColumns = @JoinColumn(name = "user_id"),
        inverseJoinColumns = @JoinColumn(name = "permission_id")
    )
    private Set<Permission> permissions = new HashSet<>();

    // LEGADO: Campo JSON - manter temporariamente para migração gradual
    // TODO: Remover após migração completa para user_permissions
    // @JdbcTypeCode(SqlTypes.JSON)
    // @Column(name = "permissions_json_legacy", columnDefinition = "jsonb")
    // private String permissionsJson;

    private String phone;

    @Column(name = "birth_date")
    private LocalDate birthDate;

    @Column(name = "photo_url")
    private String photoUrl;

    private String status;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private OffsetDateTime updatedAt;

    @Column(name = "deleted_at")
    private OffsetDateTime deletedAt;
}
