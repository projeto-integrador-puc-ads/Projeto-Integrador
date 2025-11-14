package br.pucgo.ads.projetointegrador.listaCompras.entity;

import br.pucgo.ads.projetointegrador.plataforma.entity.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "historico_compras",
    uniqueConstraints = @UniqueConstraint(columnNames = {"usuario_id", "produto_a_id", "produto_b_id"}))
@Data
@NoArgsConstructor
@AllArgsConstructor
public class HistoricoCompra {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false)
    private User usuario;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "produto_a_id", nullable = false)
    private Produto produtoA;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "produto_b_id", nullable = false)
    private Produto produtoB;

    @Column(nullable = false)
    private Integer frequencia = 0;

    @Column(nullable = false)
    private Double confianca = 0.0;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
