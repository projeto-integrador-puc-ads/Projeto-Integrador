package br.pucgo.ads.projetointegrador.carehub.dto.avaliacao;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AvaliacaoRequestDTO {

    @NotNull(message = "ID do cuidador é obrigatório")
    private Long cuidadorId;

    @NotNull(message = "ID do agendamento é obrigatório")
    private Long agendamentoId;

    @NotNull(message = "Nota é obrigatória")
    @Min(value = 1, message = "Nota mínima é 1")
    @Max(value = 5, message = "Nota máxima é 5")
    private Integer nota;

    private String comentario;
}
