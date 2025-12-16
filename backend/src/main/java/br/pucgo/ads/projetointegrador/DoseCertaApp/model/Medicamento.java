package br.pucgo.ads.projetointegrador.DoseCertaApp.model;

import br.pucgo.ads.projetointegrador.plataforma.entity.User;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "medicamentos")
@JsonIgnoreProperties(ignoreUnknown = true)
public class Medicamento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Relacionamento com ANVISA
    @ManyToOne
    @JoinColumn(name = "medicamento_anvisa_id", nullable = false)
    private MedicamentoAnvisa medicamentoAnvisa;

    // Relacionamento com usuário
    @ManyToOne
    @JoinColumn(name = "usuario_id", nullable = false)
    @JsonIgnore
    private User usuario;

    // 🔥 agora é N:N — vários contatos
    @ManyToMany
    @JoinTable(
            name = "medicamento_contatos",
            joinColumns = @JoinColumn(name = "medicamento_id"),
            inverseJoinColumns = @JoinColumn(name = "contato_id")
    )
    private List<ContatoEmergencia> contatosEmergencia = new ArrayList<>();

    // DOSAGEM — comprimido
    @Column(name = "quantidade_cartela")
    private Integer quantidadeCartela;

    // DOSAGEM — líquido
    @Column(name = "total_frasco")
    private Double totalFrasco;

    @Column(name = "dose_diaria", nullable = false)
    private Integer doseDiaria;

    @Column(name = "tipo_dosagem")
    private String tipoDosagem;

    @Enumerated(EnumType.STRING)
    @Column(name = "tarja")
    private TarjaTipo tarja;

    @Column(name = "contatar_emergencia")
    private Boolean contatarEmergencia = false;

    @Column(name = "data_inicio")
    private LocalDate dataInicio;

    @Column(name = "data_fim")
    private LocalDate dataFim;

    @OneToMany(mappedBy = "medicamento", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<MedicamentoHorario> horarios;

    // ===== GETTERS / SETTERS =====
    public Long getId() { return id; }

    public MedicamentoAnvisa getMedicamentoAnvisa() { return medicamentoAnvisa; }
    public void setMedicamentoAnvisa(MedicamentoAnvisa medicamentoAnvisa) { this.medicamentoAnvisa = medicamentoAnvisa; }

    public User getUsuario() { return usuario; }
    public void setUsuario(User usuario) { this.usuario = usuario; }

    public List<ContatoEmergencia> getContatosEmergencia() {
        return contatosEmergencia;
    }

    public void setContatosEmergencia(List<ContatoEmergencia> contatosEmergencia) {
        this.contatosEmergencia = contatosEmergencia;
    }

    public Integer getQuantidadeCartela() { return quantidadeCartela; }
    public void setQuantidadeCartela(Integer quantidadeCartela) { this.quantidadeCartela = quantidadeCartela; }

    public Double getTotalFrasco() { return totalFrasco; }
    public void setTotalFrasco(Double totalFrasco) { this.totalFrasco = totalFrasco; }

    public Integer getDoseDiaria() { return doseDiaria; }
    public void setDoseDiaria(Integer doseDiaria) { this.doseDiaria = doseDiaria; }

    public String getTipoDosagem() { return tipoDosagem; }
    public void setTipoDosagem(String tipoDosagem) { this.tipoDosagem = tipoDosagem; }

    public TarjaTipo getTarja() { return tarja; }
    public void setTarja(TarjaTipo tarja) {
        this.tarja = tarja;
        if (tarja == TarjaTipo.PRETA) {
            this.contatarEmergencia = true;
        }
    }

    public Boolean getContatarEmergencia() { return contatarEmergencia; }
    public void setContatarEmergencia(Boolean contatarEmergencia) { this.contatarEmergencia = contatarEmergencia; }

    public LocalDate getDataInicio() { return dataInicio; }
    public void setDataInicio(LocalDate dataInicio) { this.dataInicio = dataInicio; }

    public LocalDate getDataFim() { return dataFim; }
    public void setDataFim(LocalDate dataFim) { this.dataFim = dataFim; }

    public List<MedicamentoHorario> getHorarios() { return horarios; }
    public void setHorarios(List<MedicamentoHorario> horarios) { this.horarios = horarios; }

    // ===== CÁLCULO DE DIAS =====
    public int calcularDias() {
        if (doseDiaria == null || doseDiaria <= 0) return 0;

        if (quantidadeCartela != null && quantidadeCartela > 0)
            return quantidadeCartela / doseDiaria;

        if (totalFrasco != null && totalFrasco > 0)
            return (int) Math.floor(totalFrasco / doseDiaria);

        return 0;
    }
}
