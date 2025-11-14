package br.pucgo.ads.projetointegrador.listaCompras.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "lista_item")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ItemLista {

    @EmbeddedId
    private ItemListaId id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("listaId")
    @JoinColumn(name = "lista_id", nullable = false)
    private Lista lista;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("produtoId")
    @JoinColumn(name = "produto_id", nullable = false)
    private Produto produto;

    @Column(name = "qtd", precision = 10, scale = 2)
    private BigDecimal quantidade = BigDecimal.ONE;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    // --------- CAMPOS APENAS DA API (NÃO EXISTEM NO SCRIPT) ----------

    @Transient
    private Boolean comprado = false;
}
