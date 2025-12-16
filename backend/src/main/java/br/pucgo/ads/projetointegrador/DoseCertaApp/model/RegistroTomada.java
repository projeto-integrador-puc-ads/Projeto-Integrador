package br.pucgo.ads.projetointegrador.DoseCertaApp.model;


import br.pucgo.ads.projetointegrador.plataforma.entity.User;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.Duration;

@Entity
@Table(name = "registros_tomada")
public class RegistroTomada {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Dia que deveria tomar
    @Column(nullable = false)
    private LocalDate dataPrevista;

    // Horário previsto para tomar
    @Column
    private LocalTime horarioPrevisto;

    // Horário real que o usuário tomou
    @Column
    private LocalTime horarioRealTomado;

    // Se tomou ou não
    @Column(nullable = false)
    private Boolean tomado = false;

    // Atraso em minutos (negativo = adiantado)
    @Column
    private Integer atrasoMinutos;

    @ManyToOne
    @JoinColumn(name = "medicamento_id", nullable = false)
    private Medicamento medicamento;

    @ManyToOne
    @JoinColumn(name = "usuario_id", nullable = false, referencedColumnName = "id")
    @JsonIgnore
    private User usuario;

    @ManyToOne
    @JoinColumn(name = "horario_id")
    private MedicamentoHorario horarioMedicamento;

    // ===== MÉTODO PARA REGISTRAR A TOMADA =====
    public void registrarTomada(LocalTime horaReal) {
        this.horarioRealTomado = horaReal;
        this.tomado = true;

        if (horarioPrevisto != null && horaReal != null) {
            this.atrasoMinutos = (int) Duration.between(horarioPrevisto, horaReal).toMinutes();
        } else {
            this.atrasoMinutos = null; // caso não seja possível calcular
        }
    }

    // ===== GETTERS & SETTERS =====
    public Long getId() { return id; }

    public LocalDate getDataPrevista() { return dataPrevista; }
    public void setDataPrevista(LocalDate dataPrevista) { this.dataPrevista = dataPrevista; }

    public LocalTime getHorarioPrevisto() { return horarioPrevisto; }
    public void setHorarioPrevisto(LocalTime horarioPrevisto) { this.horarioPrevisto = horarioPrevisto; }

    public LocalTime getHorarioRealTomado() { return horarioRealTomado; }
    public void setHorarioRealTomado(LocalTime horarioRealTomado) { this.horarioRealTomado = horarioRealTomado; }

    public Boolean getTomado() { return tomado; }
    public void setTomado(Boolean tomado) { this.tomado = tomado; }

    public Integer getAtrasoMinutos() { return atrasoMinutos; }
    public void setAtrasoMinutos(Integer atrasoMinutos) { this.atrasoMinutos = atrasoMinutos; }

    public Medicamento getMedicamento() { return medicamento; }
    public void setMedicamento(Medicamento medicamento) { this.medicamento = medicamento; }

    public User getUsuario() { return usuario; }
    public void setUsuario(User usuario) { this.usuario = usuario; }

    public MedicamentoHorario getHorarioMedicamento() { return horarioMedicamento; }
    public void setHorarioMedicamento(MedicamentoHorario horarioMedicamento) { this.horarioMedicamento = horarioMedicamento; }
    // Compatibilidade com código antigo / DTOs que usam "data"
// Compatibilidade com código antigo / DTOs que usam "data"
    public LocalDate getData() {
        return this.dataPrevista;
    }

    public void setData(LocalDate data) {
        this.dataPrevista = data;
    }

    public void setHorario(LocalTime horario) {
        this.horarioPrevisto = horario;
    }

    // Getter boolean padrão JavaBeans
    public boolean isTomado() {
        return this.tomado;
    }

}
