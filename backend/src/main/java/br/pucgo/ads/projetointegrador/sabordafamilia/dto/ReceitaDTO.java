package br.pucgo.ads.projetointegrador.sabordafamilia.dto;

import java.util.List;

public class ReceitaDTO {
    private Long id;
    private String titulo;
    private String ingredientes;
    private String modoPreparo;
    private String historia;
    private String imagem;
    private String autorNome;
    private Long autorId;
    private int curtidas;
    private List<ComentarioDTO> comentarios;

    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public String getTitulo() {
        return titulo;
    }
    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }
    public String getIngredientes() {
        return ingredientes;
    }
    public void setIngredientes(String ingredientes) {
        this.ingredientes = ingredientes;
    }
    public String getModoPreparo() {
        return modoPreparo;
    }
    public void setModoPreparo(String modoPreparo) {
        this.modoPreparo = modoPreparo;
    }
    public String getHistoria() {
        return historia;
    }
    public void setHistoria(String historia) {
        this.historia = historia;
    }
    public String getImagem() {
        return imagem;
    }
    public void setImagem(String imagem) {
        this.imagem = imagem;
    }
    public String getAutorNome() {
        return autorNome;
    }
    public void setAutorNome(String autorNome) {
        this.autorNome = autorNome;
    }
    public Long getAutorId() {
        return autorId;
    }
    public void setAutorId(Long autorId) {
        this.autorId = autorId;
    }
    public int getCurtidas() {
        return curtidas;
    }
    public void setCurtidas(int curtidas) {
        this.curtidas = curtidas;
    }
    public List<ComentarioDTO> getComentarios() {
        return comentarios;
    }
    public void setComentarios(List<ComentarioDTO> comentarios) {
        this.comentarios = comentarios;
    }
}

