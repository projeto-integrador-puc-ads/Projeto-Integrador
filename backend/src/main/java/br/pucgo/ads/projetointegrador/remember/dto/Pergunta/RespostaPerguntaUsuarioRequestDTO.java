package br.pucgo.ads.projetointegrador.remember.dto.Pergunta;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class RespostaPerguntaUsuarioRequestDTO {

    @NotNull(message = "O identificador da pergunta é obrigatório.")
    private Long identificadorPergunta;

    @NotNull(message = "O identificador do usuário é obrigatório.")
    private Long identificadorUsuario;

    @NotBlank(message = "O texto da resposta не pode estar em branco.")
    private String textoResposta;
}