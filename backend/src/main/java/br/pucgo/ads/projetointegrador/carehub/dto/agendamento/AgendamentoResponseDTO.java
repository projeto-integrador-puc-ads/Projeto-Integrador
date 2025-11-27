package br.pucgo.ads.projetointegrador.carehub.dto.agendamento;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AgendamentoResponseDTO {

    private Long id;
    private Long cuidadorId;
    private String cuidadorNome;
    private Long clienteId;
    private String clienteNome;
    private LocalDateTime dataHoraInicio;
    private LocalDateTime dataHoraFim;
    private String status;
    private String observacoes;
    private String tipoAtendimento;
    private LocalDateTime dataSolicitacao;
    private LocalDateTime proposedDataHoraInicio;
    private LocalDateTime proposedDataHoraFim;
}
