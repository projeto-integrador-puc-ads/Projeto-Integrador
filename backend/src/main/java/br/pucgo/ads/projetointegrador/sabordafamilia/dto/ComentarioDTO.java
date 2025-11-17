package br.pucgo.ads.projetointegrador.sabordafamilia.dto;

public class ComentarioDTO {
    private Long id;
    private String texto;
    private String autorNome;
    private Long receitaId;

    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public String getTexto() {
        return texto;
    }
    public void setTexto(String texto) {
        this.texto = texto;
    }
    public String getAutorNome() {
        return autorNome;
    }
    public void setAutorNome(String autorNome) {
        this.autorNome = autorNome;
    }
    public Long getReceitaId() {
        return receitaId;
    }
    public void setReceitaId(Long receitaId) {
        this.receitaId = receitaId;
    }
}
