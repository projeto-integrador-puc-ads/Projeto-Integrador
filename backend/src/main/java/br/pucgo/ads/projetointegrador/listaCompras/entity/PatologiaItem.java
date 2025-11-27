package br.pucgo.ads.projetointegrador.listaCompras.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "patologia_itens", uniqueConstraints = @UniqueConstraint(columnNames = {"patologia_id", "produto_id"}))
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PatologiaItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patologia_id", nullable = false)
    private Patologia patologia;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name ="produto_id", nullable = false)
    private Produto produto;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "produto_sugestao_id")
    private Produto produtoSugestao; // Produto pra substituir o produto alertado

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
