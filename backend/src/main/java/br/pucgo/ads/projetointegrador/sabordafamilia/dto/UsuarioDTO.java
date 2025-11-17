package br.pucgo.ads.projetointegrador.sabordafamilia.dto;

import java.util.Set;

public class UsuarioDTO {
    private Long id;
    private String nome;
    private String email;
    private String fotoPerfil;
    private Set<Long> favoritos; // lista de IDs das receitas favoritas

    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public String getNome() {
        return nome;
    }
    public void setNome(String nome) {
        this.nome = nome;
    }
    public String getEmail() {
        return email;
    }
    public void setEmail(String email) {
        this.email = email;
    }
    public String getFotoPerfil() {
        return fotoPerfil;
    }
    public void setFotoPerfil(String fotoPerfil) {
        this.fotoPerfil = fotoPerfil;
    }
    public Set<Long> getFavoritos() {
        return favoritos;
    }
    public void setFavoritos(Set<Long> favoritos) {
        this.favoritos = favoritos;
    }
}
