package br.pucgo.ads.projetointegrador.DoseCertaApp.dto;

import lombok.Data;
import java.util.List;

@Data
public class CreateMedicamentoRequest {

    // SOMENTE UM DOS DOIS SERÁ ENVIADO
    private Double totalFrasco;            // para ml (líquido)
    private Integer quantidadeCartela;     // para comprimido

    private Integer doseDiaria;            // ml ou mg por dose
    private String tipoDosagem;            // "ml" ou "mg"

    private String tarja;                  // SEM_TARJA, AMARELA, VERMELHA, PRETA

    private List<HorarioDto> horarios;     // lista de horários

    @Data
    public static class HorarioDto {
        private String hora;               // formato "HH:mm"
    }
}
