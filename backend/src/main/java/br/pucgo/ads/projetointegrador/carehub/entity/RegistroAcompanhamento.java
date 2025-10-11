package br.pucgo.ads.projetointegrador.carehub.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "carehub_registros_acompanhamento")
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

    @Column(columnDefinition = "TEXT")
    private String pressaoArterial;

    @Column(columnDefinition = "TEXT")
    private String glicemia;

    @Column(columnDefinition = "TEXT")
    private String medicamentosAdministrados;

    @Column(columnDefinition = "TEXT")
    private String alimentacao;

    @Column(columnDefinition = "TEXT")
    private String atividadesRealizadas;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String observacoes;

    @Column(columnDefinition = "TEXT")
    private String intercorrencias;

    @Column(name = "humor_estado", length = 50)
    private String humorEstado; // Ex: Alegre, Triste, Confuso, Calmo

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
