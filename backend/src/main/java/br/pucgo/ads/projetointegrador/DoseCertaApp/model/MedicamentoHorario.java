package br.pucgo.ads.projetointegrador.DoseCertaApp.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name = "medicamento_horarios")
public class MedicamentoHorario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "medicamento_id", nullable = false)
    @JsonIgnore
    private Medicamento medicamento;

    @Column(name = "horario", nullable = false)
    private String horario; // formato "08:00"

    @Column(name = "tomado_hoje")
    private Boolean tomadoHoje = false;

    @Column(name = "notificado")
    private Boolean notificado = false;

    @Column(name = "data_ultima_atualizacao")
    private LocalDate dataUltimaAtualizacao;

    @Column(name = "proxima_execucao")
    private LocalDateTime proximaExecucao;

    public MedicamentoHorario() {}

    public MedicamentoHorario(Medicamento medicamento, String horario) {
        this.medicamento = medicamento;
        this.horario = horario;
        this.tomadoHoje = false;
        this.notificado = false;
        this.dataUltimaAtualizacao = LocalDate.now();

        calcularProximaExecucao(); // define proxima_execucao
    }

    // =========================================================
    // GETTERS / SETTERS
    // =========================================================

    public Long getId() { return id; }

    public Medicamento getMedicamento() { return medicamento; }

    public void setMedicamento(Medicamento medicamento) { this.medicamento = medicamento; }

    public String getHorario() { return horario; }

    public void setHorario(String horario) {
        this.horario = horario;
        calcularProximaExecucao(); // recalcula sempre que horário mudar
    }

    public Boolean getTomadoHoje() { return tomadoHoje; }

    public void setTomadoHoje(Boolean tomadoHoje) { this.tomadoHoje = tomadoHoje; }

    public Boolean getNotificado() { return notificado; }

    public void setNotificado(Boolean notificado) { this.notificado = notificado; }

    public LocalDate getDataUltimaAtualizacao() { return dataUltimaAtualizacao; }

    public void setDataUltimaAtualizacao(LocalDate dataUltimaAtualizacao) { this.dataUltimaAtualizacao = dataUltimaAtualizacao; }

    public LocalDateTime getProximaExecucao() { return proximaExecucao; }

    public void setProximaExecucao(LocalDateTime proximaExecucao) { this.proximaExecucao = proximaExecucao; }

    // =========================================================
    // Converte "08:00" → LocalDateTime de hoje
    // =========================================================
    @JsonIgnore
    public LocalDateTime getHorarioComoDataHora() {
        LocalTime hora = LocalTime.parse(this.horario);
        return LocalDateTime.of(LocalDate.now(), hora);
    }

    // =========================================================
    // Define corretamente a próxima execução (hoje ou amanhã)
    // =========================================================
    public void calcularProximaExecucao() {
        LocalTime hora = LocalTime.parse(this.horario);
        LocalDate hoje = LocalDate.now();

        LocalDateTime horarioHoje = LocalDateTime.of(hoje, hora);

        // Se horário ainda vai acontecer hoje → usa hoje
        if (horarioHoje.isAfter(LocalDateTime.now())) {
            this.proximaExecucao = horarioHoje;
        }
        // Caso contrário → joga para amanhã
        else {
            this.proximaExecucao = horarioHoje.plusDays(1);
        }
    }

    // =========================================================
    // Reset diário → libera tomada e notificação
    // =========================================================
    public void resetarSeNovoDia() {
        if (dataUltimaAtualizacao == null ||
                !dataUltimaAtualizacao.equals(LocalDate.now())) {

            this.tomadoHoje = false;

            // Libera notificação novamente
            this.notificado = false;

            this.dataUltimaAtualizacao = LocalDate.now();

            calcularProximaExecucao(); // atualiza para o novo dia
        }
    }

    // =========================================================
    // Callbacks JPA
    // =========================================================
    @PrePersist
    public void prePersist() {
        if (dataUltimaAtualizacao == null) {
            dataUltimaAtualizacao = LocalDate.now();
        }

        if (tomadoHoje == null)
            tomadoHoje = false;

        calcularProximaExecucao();

        // 🔥 NÃO BLOQUEAR NOTIFICAÇÕES
        // notificado deve sempre iniciar falso
        if (notificado == null)
            notificado = false;
    }

    @PreUpdate
    public void preUpdate() {
        dataUltimaAtualizacao = LocalDate.now();
    }
}
