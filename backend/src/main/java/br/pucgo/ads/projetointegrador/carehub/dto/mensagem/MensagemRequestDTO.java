package br.pucgo.ads.projetointegrador.carehub.dto.mensagem;

import jakarta.validation.constraints.NotBlank;
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

    @NotBlank(message = "Conteúdo da mensagem é obrigatório")
    private String conteudo;
}
