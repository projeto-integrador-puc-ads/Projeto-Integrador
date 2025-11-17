package br.pucgo.ads.projetointegrador.sabordafamilia.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "sabordafamilia_usuario")
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_usuario") // <-- CORRIGIDO (era 'id')
    private Long id;

    @Column(nullable = false)
    private String nome;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String senha;

    private Integer idade;

    @Column(name = "interesses_culinarios")
    private String interessesCulinarios;

    @Column(name = "foto_perfil")
    private String fotoPerfil;

    @JsonIgnore
    @OneToMany(mappedBy = "autor", cascade = CascadeType.ALL)
    private Set<Receita> receitas = new HashSet<>();

    @JsonIgnore
    @ManyToMany
    @JoinTable(
            name = "sabordafamilia_favorito", // Tabela de junção correta
            joinColumns = @JoinColumn(name = "id_usuario"), // <-- CORRIGIDO
            inverseJoinColumns = @JoinColumn(name = "id_receita") // <-- CORRIGIDO
    )
    private Set<Receita> favoritos = new HashSet<>();

    // Getters e Setters (pode usar Lombok @Data, @Getter, @Setter)
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getSenha() { return senha; }
    public void setSenha(String senha) { this.senha = senha; }
    public Integer getIdade() { return idade; }
    public void setIdade(Integer idade) { this.idade = idade; }
    public String getInteressesCulinarios() { return interessesCulinarios; }
    public void setInteressesCulinarios(String interessesCulinarios) { this.interessesCulinarios = interessesCulinarios; }
    public String getFotoPerfil() { return fotoPerfil; }
    public void setFotoPerfil(String fotoPerfil) { this.fotoPerfil = fotoPerfil; }
    public Set<Receita> getReceitas() { return receitas; }
    public void setReceitas(Set<Receita> receitas) { this.receitas = receitas; }
    public Set<Receita> getFavoritos() { return favoritos; }
    public void setFavoritos(Set<Receita> favoritos) { this.favoritos = favoritos; }
}