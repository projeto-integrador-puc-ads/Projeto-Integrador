package br.pucgo.ads.projetointegrador.remember.dto.Pergunta;

import br.pucgo.ads.projetointegrador.remember.entity.RespostaPerguntaUsuario;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class RespostaPerguntaUsuarioResponseDTO {
    private Long identificadorRespostaPerguntaUsuario;
    private Long identificadorPergunta;
    private Long identificadorUsuario;
    private String textoResposta;
    private LocalDateTime dataResposta;

    public RespostaPerguntaUsuarioResponseDTO(RespostaPerguntaUsuario resposta) {
        this.identificadorRespostaPerguntaUsuario = resposta.getIdentificadorRespostaPerguntaUsuario();
        this.identificadorPergunta = resposta.getIdentificadorPergunta();
        this.identificadorUsuario = resposta.getIdentificadorUsuario();
        this.textoResposta = resposta.getTextoResposta();
        this.dataResposta = resposta.getDataResposta();
    }
}
