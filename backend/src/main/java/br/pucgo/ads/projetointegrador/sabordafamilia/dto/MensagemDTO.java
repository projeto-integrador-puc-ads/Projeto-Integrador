package br.pucgo.ads.projetointegrador.sabordafamilia.dto;

public class MensagemDTO {
    private Long id;
    private Long remetenteId;
    private Long destinatarioId;
    private String conteudo;
    private String tipo; // texto, imagem, vídeo
    private String dataEnvio;

    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public Long getRemetenteId() {
        return remetenteId;
    }
    public void setRemetenteId(Long remetenteId) {
        this.remetenteId = remetenteId;
    }
    public Long getDestinatarioId() {
        return destinatarioId;
    }
    public void setDestinatarioId(Long destinatarioId) {
        this.destinatarioId = destinatarioId;
    }
    public String getConteudo() {
        return conteudo;
    }
    public void setConteudo(String conteudo) {
        this.conteudo = conteudo;
    }
    public String getTipo() {
        return tipo;
    }
    public void setTipo(String tipo) {
        this.tipo = tipo;
    }
    public String getDataEnvio() {
        return dataEnvio;
    }
    public void setDataEnvio(String dataEnvio) {
        this.dataEnvio = dataEnvio;
    }
}
