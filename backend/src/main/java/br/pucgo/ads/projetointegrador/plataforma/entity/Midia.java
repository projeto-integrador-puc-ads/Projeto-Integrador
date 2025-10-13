package br.pucgo.ads.projetointegrador.plataforma.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "midia")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Midia {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID identificadorMidia;

    @Column(name = "id_lembranca")
    private UUID identificadorLembranca;

    @Column(name = "id_diario")
    private UUID identificadorDiario;

    @Column(name = "url_arquivo", nullable = false, length = 512)
    private String urlArquivo;

    @Column(name = "data_upload", nullable = false, updatable = false)
    private LocalDateTime dataUpload;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_lembranca", insertable = false, updatable = false)
    private Lembranca lembranca;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_diario", insertable = false, updatable = false)
    private Diario diario;

    @PrePersist
    protected void onCreate() {
        dataUpload = LocalDateTime.now();
    }
}
