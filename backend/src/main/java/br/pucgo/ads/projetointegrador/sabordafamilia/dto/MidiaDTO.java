package br.pucgo.ads.projetointegrador.sabordafamilia.dto;

public class MidiaDTO {
    private Long id;
    private String url;
    private String tipo; // imagem, vídeo, etc.
    private Long receitaId;

    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public String getUrl() {
        return url;
    }
    public void setUrl(String url) {
        this.url = url;
    }
    public String getTipo() {
        return tipo;
    }
    public void setTipo(String tipo) {
        this.tipo = tipo;
    }
    public Long getReceitaId() {
        return receitaId;
    }
    public void setReceitaId(Long receitaId) {
        this.receitaId = receitaId;
    }
}
