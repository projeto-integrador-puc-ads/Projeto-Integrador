package br.pucgo.ads.projetointegrador.carehub.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "carehub_prontuarios")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Prontuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "cliente_id", nullable = false)
    private Cliente cliente;

    @Column(name = "data_nascimento")
    private LocalDate dataNascimento;

    @Column(columnDefinition = "TEXT")
    private String historicoMedico;

    @Column(columnDefinition = "TEXT")
    private String medicamentosUso;

    @Column(columnDefinition = "TEXT")
    private String alergias;

    @Column(columnDefinition = "TEXT")
    private String contatosEmergencia;

    @Column(columnDefinition = "TEXT")
    private String observacoesGerais;

    @Column(name = "tipo_sanguineo", length = 5)
    private String tipoSanguineo;

    @Column(name = "necessidades_especiais", columnDefinition = "TEXT")
    private String necessidadesEspeciais;

    @Column(name = "data_criacao", nullable = false, updatable = false)
    private LocalDateTime dataCriacao;

    @Column(name = "data_atualizacao")
    private LocalDateTime dataAtualizacao;

    @PrePersist
    protected void onCreate() {
        dataCriacao = LocalDateTime.now();
        dataAtualizacao = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        dataAtualizacao = LocalDateTime.now();
    }
}
