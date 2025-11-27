package br.pucgo.ads.projetointegrador.listaCompras.entity;

import br.pucgo.ads.projetointegrador.plataforma.entity.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "lista")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Lista {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User usuario;

    @Column(nullable = false)
    private String titulo;

    @ManyToOne(fetch = FetchType.LAZY, optional = true)
    @JoinColumn(name = "patologia_id")
    private Patologia patologia;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "is_template", nullable = false)
    private Boolean template = false;

    // --------- CAMPOS APENAS DA API (NÃO EXISTEM NO SCRIPT) ----------

    @Transient
    private String descricao;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    private StatusLista status = StatusLista.ABERTA;


    public enum StatusLista {
        ABERTA,
        FINALIZADA
    }
}
