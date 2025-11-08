package br.pucgo.ads.projetointegrador.carehub.dto.prontuario;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProntuarioResponseDTO {

    private Long id;
    private Long clienteId;
    private String clienteNome;
    private LocalDate dataNascimento;
    private String historicoMedico;
    private String medicamentosUso;
    private String alergias;
    private String contatoEmergencia;
    private String observacoesGerais;
    private String tipoSanguineo;
    private String necessidadesEspeciais;
    private LocalDateTime dataCriacao;
    private LocalDateTime dataAtualizacao;
}
