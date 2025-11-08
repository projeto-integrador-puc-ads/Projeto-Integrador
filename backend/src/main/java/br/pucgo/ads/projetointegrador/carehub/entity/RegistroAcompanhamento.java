package br.pucgo.ads.projetointegrador.carehub.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "ch_registro_acompanhamento")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegistroAcompanhamento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "agendamento_id", nullable = false)
    private Agendamento agendamento;

    @ManyToOne
    @JoinColumn(name = "cuidador_id", nullable = false)
    private Cuidador cuidador;

    @ManyToOne
    @JoinColumn(name = "cliente_id", nullable = false)
    private Cliente cliente;

    @Column(name = "data_hora_registro", nullable = false)
    private LocalDateTime dataHoraRegistro;

    @Column(name = "pressao_arterial", length = 32)
    private String pressaoArterial;

    @Column(length = 32)
    private String glicemia;

    @Column(name = "medicamentos_administrados", columnDefinition = "TEXT")
    private String medicamentosAdministrados;

    @Column(columnDefinition = "TEXT")
    private String alimentacao;

    @Column(name = "atividades_realizadas", columnDefinition = "TEXT")
    private String atividadesRealizadas;

    @Column(columnDefinition = "TEXT")
    private String observacoes;

    @Column(columnDefinition = "TEXT")
    private String intercorrencias;

    @Column(name = "sinais_vitais", columnDefinition = "TEXT")
    private String sinaisVitais;

    @Column(name = "data_criacao", nullable = false, updatable = false)
    private LocalDateTime dataCriacao;

    @Column(name = "data_atualizacao")
    private LocalDateTime dataAtualizacao;

    @PrePersist
    protected void onCreate() {
        dataCriacao = LocalDateTime.now();
        dataAtualizacao = LocalDateTime.now();
        if (dataHoraRegistro == null) {
            dataHoraRegistro = LocalDateTime.now();
        }
    }

    @PreUpdate
    protected void onUpdate() {
        dataAtualizacao = LocalDateTime.now();
    }
}
