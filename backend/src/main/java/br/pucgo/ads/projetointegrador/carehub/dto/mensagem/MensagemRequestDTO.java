package br.pucgo.ads.projetointegrador.carehub.dto.mensagem;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MensagemRequestDTO {

    @NotNull(message = "ID do destinatário é obrigatório")
    private Long destinatarioId;
    /** Texto da mensagem (opcional se enviar mídia) */
    private String conteudo;

    /** Se a mensagem contém mídia (áudio/imagem), enviar a URL retornada pelo upload */
    private String mediaUrl;

    /** Tipo MIME da mídia (ex: audio/webm) */
    private String mediaType;
}
