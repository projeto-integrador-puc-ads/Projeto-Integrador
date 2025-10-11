package br.pucgo.ads.projetointegrador.carehub.dto.agendamento;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AgendamentoRequestDTO {

    @NotNull(message = "Cuidador é obrigatório")
    private Long cuidadorId;

    @NotNull(message = "Cliente é obrigatório")
    private Long clienteId;

    @NotNull(message = "Data/hora de início é obrigatória")
    private LocalDateTime dataHoraInicio;

    @NotNull(message = "Data/hora de fim é obrigatória")
    private LocalDateTime dataHoraFim;

    private String observacoes;
    private String tipoAtendimento;
}
