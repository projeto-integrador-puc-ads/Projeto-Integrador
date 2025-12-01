package br.pucgo.ads.projetointegrador.carehub.dto.mensagem;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MensagemResponseDTO {
    private Long id;
    private Long remetenteId;
    private String remetenteNome;
    private Long destinatarioId;
    private String destinatarioNome;
    private String conteudo;
    private LocalDateTime dataEnvio;
    private Boolean lida;
    private String mediaUrl;
    private String mediaType;
}
