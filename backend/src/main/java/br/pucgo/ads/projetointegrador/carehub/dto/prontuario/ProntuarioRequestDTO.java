package br.pucgo.ads.projetointegrador.carehub.dto.prontuario;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProntuarioRequestDTO {

    @NotNull(message = "Cliente é obrigatório")
    private Long clienteId;

    private LocalDate dataNascimento;

    @NotBlank(message = "Histórico médico é obrigatório")
    private String historicoMedico;

    private String medicamentosUso;
    private String alergias;
    private String contatoEmergencia;
    private String observacoesGerais;
    private String tipoSanguineo;
    private String necessidadesEspeciais;
}
