package br.pucgo.ads.projetointegrador.carehub.dto.avaliacao;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AvaliacaoResponseDTO {
    private Long id;
    private Long cuidadorId;
    private String cuidadorNome;
    private Long clienteId;
    private String clienteNome;
    private Integer nota;
    private String comentario;
    private LocalDateTime dataAvaliacao;
    private Long agendamentoId;
}
