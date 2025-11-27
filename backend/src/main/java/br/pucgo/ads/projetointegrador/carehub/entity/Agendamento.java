package br.pucgo.ads.projetointegrador.carehub.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "ch_agendamento")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Agendamento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "cuidador_id", nullable = false)
    private Cuidador cuidador;

    @ManyToOne
    @JoinColumn(name = "cliente_id", nullable = false)
    private Cliente cliente;

    @Column(name = "data_hora_inicio", nullable = false)
    private LocalDateTime dataHoraInicio;

    @Column(name = "data_hora_fim", nullable = false)
    private LocalDateTime dataHoraFim;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 32)
    private StatusAgendamento status;

    @Column(columnDefinition = "TEXT")
    private String observacoes;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_atendimento", length = 32)
    private TipoAtendimento tipoAtendimento;

    @Column(name = "data_solicitacao")
    private LocalDateTime dataSolicitacao;

    // Campos para contraproposta feita pelo cuidador
    @Column(name = "proposed_data_hora_inicio")
    private LocalDateTime proposedDataHoraInicio;

    @Column(name = "proposed_data_hora_fim")
    private LocalDateTime proposedDataHoraFim;

    public enum StatusAgendamento {
    PENDENTE,
        CONFIRMADO,
        REAGENDADO,
        EM_ANDAMENTO,
        CONCLUIDO,
        CANCELADO
    }

    @PrePersist
    protected void onCreate() {
        if (dataSolicitacao == null) {
            dataSolicitacao = LocalDateTime.now();
        }
        if (status == null) {
            status = StatusAgendamento.PENDENTE;
        }
    }
}
