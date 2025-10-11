package br.pucgo.ads.projetointegrador.carehub.dto.registro;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegistroAcompanhamentoRequestDTO {

    @NotNull(message = "Agendamento é obrigatório")
    private Long agendamentoId;

    private LocalDateTime dataHoraRegistro;
    private String pressaoArterial;
    private String glicemia;
    private String medicamentosAdministrados;
    private String alimentacao;
    private String atividadesRealizadas;

    @NotNull(message = "Observações são obrigatórias")
    private String observacoes;

    private String intercorrencias;
    private String humorEstado;
}
