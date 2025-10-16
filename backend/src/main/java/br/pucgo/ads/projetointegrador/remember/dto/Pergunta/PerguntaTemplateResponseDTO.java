package br.pucgo.ads.projetointegrador.remember.dto.Pergunta;

import br.pucgo.ads.projetointegrador.remember.entity.PerguntaTemplate;
import lombok.Data;

@Data
public class PerguntaTemplateResponseDTO {

    private Long identificadorPerguntaTemplate;
    private String textoTemplate;
    private Integer gatilhoTipo;
    private String gatilhoValores;
    private String campoAlvo;
    private String campoPlaceholder;
    private boolean ativo;

    public PerguntaTemplateResponseDTO(PerguntaTemplate template) {
        this.identificadorPerguntaTemplate = template.getIdentificadorPerguntaTemplate();
        this.textoTemplate = template.getTextoTemplate();
        this.gatilhoTipo = template.getGatilhoTipo();
        this.gatilhoValores = template.getGatilhoValores();
        this.campoAlvo = template.getCampoAlvo();
        this.campoPlaceholder = template.getCampoPlaceholder();
        this.ativo = template.isAtivo();
    }
}
