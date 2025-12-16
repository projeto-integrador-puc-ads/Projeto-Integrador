package br.pucgo.ads.projetointegrador.DoseCertaApp.model;

import br.pucgo.ads.projetointegrador.plataforma.entity.User;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(name = "contatos_emergencia")
public class ContatoEmergencia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "nome", nullable = false)
    private String nome;

    @Column(name = "telefone", nullable = false)
    private String telefone;

    @Column(name = "relacao")
    private String relacao;  // ⚠️ Campo que faltava

    @ManyToOne
    @JoinColumn(name = "usuario_id", nullable = false, referencedColumnName = "id")
    private User usuario;

    // ===== Getters & Setters
    public Long getId() { return id; }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public String getTelefone() { return telefone; }
    public void setTelefone(String telefone) { this.telefone = telefone; }

    public String getRelacao() { return relacao; }
    public void setRelacao(String relacao) { this.relacao = relacao; }

    public User getUsuario() { return usuario; }
    public void setUsuario(User usuario) { this.usuario = usuario; }
}
