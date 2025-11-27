package br.pucgo.ads.projetointegrador.carehub.dto.agendamento;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ContrapropostaRequestDTO {
    private LocalDateTime dataHoraInicio;
    private LocalDateTime dataHoraFim;
}
