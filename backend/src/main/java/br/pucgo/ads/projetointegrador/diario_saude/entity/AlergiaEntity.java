package br.pucgo.ads.projetointegrador.diario_saude.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "ds_alergia")
public class AlergiaEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "codigo", nullable = false, length = 200)
    private String codigo;

    @Column(name = "nome", nullable = false, length = 1000)
    private String nome;

    @Column(name = "categoria", length = 500)
    private String categoria;

    public AlergiaEntity() {}

    // Getters e Setters
    public Long getId() { return id; }

    public String getCodigo() { return codigo; }
    public void setCodigo(String codigo) { this.codigo = codigo; }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public String getCategoria() { return categoria; }
    public void setCategoria(String categoria) { this.categoria = categoria; }
}
