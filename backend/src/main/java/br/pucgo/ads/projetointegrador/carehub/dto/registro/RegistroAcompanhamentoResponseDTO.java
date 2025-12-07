package br.pucgo.ads.projetointegrador.carehub.dto.registro;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegistroAcompanhamentoResponseDTO {

    private Long id;
    private Long agendamentoId;
    private String agendamentoStatus; // Status do agendamento (PENDENTE, CONFIRMADO, EM_ANDAMENTO, CONCLUIDO, etc)
    private Long cuidadorId;
    private String cuidadorNome;
    private Long clienteId;
    private String clienteNome;
    private LocalDateTime dataHoraRegistro;
    private String pressaoArterial;
    private String glicemia;
    private String medicamentosAdministrados;
    private String alimentacao;
    private String atividadesRealizadas;
    private String observacoes;
    private String intercorrencias;
    private String sinaisVitais;
    private LocalDateTime dataCriacao;
}
