package br.pucgo.ads.projetointegrador.carehub.entity;

import br.pucgo.ads.projetointegrador.plataforma.entity.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "ch_mensagem")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Mensagem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "remetente_id", nullable = false)
    private User remetente;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "destinatario_id", nullable = false)
    private User destinatario;

    @Column(nullable = true, columnDefinition = "TEXT")
    private String conteudo;

    // Campos para mídia (áudio, imagem, etc.)
    @Column(name = "media_url", length = 1024)
    private String mediaUrl;

    @Column(name = "media_type", length = 128)
    private String mediaType;

    @CreationTimestamp
    @Column(name = "data_envio", nullable = false, updatable = false)
    private LocalDateTime dataEnvio;

    @Column(nullable = false)
    private Boolean lida = false;
}
