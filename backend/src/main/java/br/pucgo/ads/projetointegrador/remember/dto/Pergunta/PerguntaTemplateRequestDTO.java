package br.pucgo.ads.projetointegrador.remember.dto.Pergunta;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class PerguntaTemplateRequestDTO {

    @NotBlank(message = "O texto do template não pode estar em branco.")
    private String textoTemplate;

    @NotNull(message = "O tipo do gatilho é obrigatório.")
    private Integer gatilhoTipo;

    private String gatilhoValores;

    private String campoAlvo;

    private String campoPlaceholder;

    private boolean ativo = true;
}
