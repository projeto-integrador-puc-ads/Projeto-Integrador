package br.pucgo.ads.projetointegrador.plataforma.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.time.OffsetDateTime;
import java.util.HashSet;
import java.util.Set;

@Data
@Entity
@Table(name = "roles")
public class Role {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String code;

    @Column(nullable = false)
    private String name;

    private String scope;

    // Relacionamento N:N com Permission (NOVO MODELO NORMALIZADO)
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "role_permissions",
        joinColumns = @JoinColumn(name = "role_id"),
        inverseJoinColumns = @JoinColumn(name = "permission_id")
    )
    private Set<Permission> permissions = new HashSet<>();

    // LEGADO: Campo JSON - manter temporariamente para migração gradual
    // TODO: Remover após migração completa para role_permissions
    // @JdbcTypeCode(SqlTypes.JSON)
    // @Column(name = "permissions_json_legacy", columnDefinition = "jsonb")
    // private String permissionsJson;

    @ManyToOne
    @JoinColumn(name = "module_id")
    private Module module;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt;
}
