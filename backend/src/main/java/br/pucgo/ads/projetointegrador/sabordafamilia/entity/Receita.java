package br.pucgo.ads.projetointegrador.sabordafamilia.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "sabordafamilia_receita")
public class Receita {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_receita")
    private Long id;

    @Column(name = "tipo_refeicao")
    private String tipoRefeicao;

    private String titulo;
    
    @Column(columnDefinition = "TEXT")
    private String ingredientes;

    @Column(name = "modo_preparo", columnDefinition = "TEXT")
    private String modoPreparo;

    @Column(name = "historia_receita", columnDefinition = "TEXT")
    private String historiaReceita;
    
    @Column(name = "data_postagem", updatable = false)
    private LocalDateTime dataPostagem;

    @ManyToOne(fetch = FetchType.EAGER) 
    @JoinColumn(name = "id_usuario", nullable = false)
    private Usuario autor;

    @JsonIgnore
    @ManyToMany(mappedBy = "favoritos", fetch = FetchType.EAGER)
    private Set<Usuario> usuariosFavoritaram = new HashSet<>();

    @JsonIgnore
    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
        name = "sabordafamilia_curtida",
        joinColumns = @JoinColumn(name = "id_receita"),
        inverseJoinColumns = @JoinColumn(name = "id_usuario")
    )
    private Set<Usuario> usuariosCurtiram = new HashSet<>();
    
    @OneToMany(mappedBy = "receita", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private List<Midia> midias;
    
    @OneToOne(mappedBy = "receita", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private Restricoes restricoes;

    // Campo auxiliar para transporte de dados (não persiste no banco)
    @Transient
    private boolean isCurtidaPeloUsuarioAtual = false;

    @PrePersist
    protected void onCreate() {
        dataPostagem = LocalDateTime.now();
    }

    // --- A CORREÇÃO ESTÁ AQUI ---
    // Colocamos a anotação no GETTER para garantir que o JSON
    // use exatamente este nome, sem cortar o "is".
    @JsonProperty("isCurtidaPeloUsuarioAtual")
    public boolean isCurtidaPeloUsuarioAtual() {
        return isCurtidaPeloUsuarioAtual;
    }

    public void setCurtidaPeloUsuarioAtual(boolean curtidaPeloUsuarioAtual) {
        isCurtidaPeloUsuarioAtual = curtidaPeloUsuarioAtual;
    }

    @Transient
    @JsonProperty("contagemCurtidas")
    public int getContagemCurtidas() {
        return this.usuariosCurtiram != null ? this.usuariosCurtiram.size() : 0;
    }

    // --- Getters e Setters Padrão ---
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTipoRefeicao() { return tipoRefeicao; }
    public void setTipoRefeicao(String tipoRefeicao) { this.tipoRefeicao = tipoRefeicao; }
    public String getTitulo() { return titulo; }
    public void setTitulo(String titulo) { this.titulo = titulo; }
    public String getIngredientes() { return ingredientes; }
    public void setIngredientes(String ingredientes) { this.ingredientes = ingredientes; }
    public String getModoPreparo() { return modoPreparo; }
    public void setModoPreparo(String modoPreparo) { this.modoPreparo = modoPreparo; }
    public String getHistoriaReceita() { return historiaReceita; }
    public void setHistoriaReceita(String historiaReceita) { this.historiaReceita = historiaReceita; }
    public LocalDateTime getDataPostagem() { return dataPostagem; }
    public void setDataPostagem(LocalDateTime dataPostagem) { this.dataPostagem = dataPostagem; }
    public Usuario getAutor() { return autor; }
    public void setAutor(Usuario autor) { this.autor = autor; }
    public Set<Usuario> getUsuariosCurtiram() { return usuariosCurtiram; }
    public void setUsuariosCurtiram(Set<Usuario> usuariosCurtiram) { this.usuariosCurtiram = usuariosCurtiram; }
    public Set<Usuario> getUsuariosFavoritaram() { return usuariosFavoritaram; }
    public void setUsuariosFavoritaram(Set<Usuario> usuariosFavoritaram) { this.usuariosFavoritaram = usuariosFavoritaram; }
    public List<Midia> getMidias() { return midias; }
    public void setMidias(List<Midia> midias) { this.midias = midias; }
    public Restricoes getRestricoes() { return restricoes; }
    public void setRestricoes(Restricoes restricoes) { this.restricoes = restricoes; }
}