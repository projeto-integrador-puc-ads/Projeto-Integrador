package br.pucgo.ads.projetointegrador.sabordafamilia.entity;

import com.fasterxml.jackson.annotation.JsonIgnore; // <-- IMPORTAR ESTE
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "sabordafamilia_comentario")
public class Comentario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_comentario")
    private Long id;

    @Column(nullable = false, length = 500)
    private String texto;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "usuario_id", nullable = false) 
    private Usuario usuario;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "receita_id", nullable = false)
    @JsonIgnore 
    private Receita receita;

    @Column(name = "data_comentario", updatable = false)
    private LocalDateTime dataComentario;
    
    @PrePersist
    protected void onCreate() {
        dataComentario = LocalDateTime.now();
    }

    // Getters e Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTexto() { return texto; }
    public void setTexto(String texto) { this.texto = texto; }
    public Usuario getUsuario() { return usuario; }
    public void setUsuario(Usuario usuario) { this.usuario = usuario; }
    public Receita getReceita() { return receita; }
    public void setReceita(Receita receita) { this.receita = receita; }
    public LocalDateTime getDataComentario() { return dataComentario; }
    public void setDataComentario(LocalDateTime dataComentario) { this.dataComentario = dataComentario; }
}