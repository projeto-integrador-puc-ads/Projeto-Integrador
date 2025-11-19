package br.pucgo.ads.projetointegrador.diario_saude.dto;

public class RespostaDTO {

    private Long perguntaId;
    private String resposta;
    private int peso;

    public RespostaDTO() {
    }

    public RespostaDTO(Long perguntaId, String resposta, int peso) {
        this.perguntaId = perguntaId;
        this.resposta = resposta;
        this.peso = peso;
    }

    public Long getPerguntaId() {
        return perguntaId;
    }

    public void setPerguntaId(Long perguntaId) {
        this.perguntaId = perguntaId;
    }

    public String getResposta() {
        return resposta;
    }

    public void setResposta(String resposta) {
        this.resposta = resposta;
    }

    public int getPeso() {
        return peso;
    }

    public void setPeso(int peso) {
        this.peso = peso;
    }
}
