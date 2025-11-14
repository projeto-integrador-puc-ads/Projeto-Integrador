package br.pucgo.ads.projetointegrador.listaCompras.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "produto_relacionado")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProdutoRelacionado {

    @EmbeddedId
    private ProdutoRelacionadoId id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("produtoId")
    @JoinColumn(name = "produto_id", nullable = false)
    private Produto produto;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("similarId")
    @JoinColumn(name = "similar_id", nullable = false)
    private Produto similar;

    @Column(nullable = false, precision = 6, scale = 4)
    private BigDecimal afinidade = BigDecimal.ZERO;

    @CreationTimestamp
    @Column(name = "atualizado_em")
    private LocalDateTime atualizadoEm;
}
