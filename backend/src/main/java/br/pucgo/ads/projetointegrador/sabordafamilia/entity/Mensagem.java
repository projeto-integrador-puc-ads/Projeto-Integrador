package br.pucgo.ads.projetointegrador.sabordafamilia.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "sabordafamilia_mensagem")
public class Mensagem {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_mensagem")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "id_remetente") 
    private Usuario remetente;

    @ManyToOne
    @JoinColumn(name = "id_destinatario") 
    private Usuario destinatario;

    @Column(name = "conteudo", columnDefinition = "TEXT")
    private String texto;
    
    @Column(name = "tipo") 
    private String tipo;
    
    @Column(name = "transcricao") 
    private String transcricao;

    @Column(name = "data_envio") 
    private LocalDateTime enviadoEm = LocalDateTime.now();
    
    @PrePersist 
    protected void onCreate() {
        enviadoEm = LocalDateTime.now();
    }
}