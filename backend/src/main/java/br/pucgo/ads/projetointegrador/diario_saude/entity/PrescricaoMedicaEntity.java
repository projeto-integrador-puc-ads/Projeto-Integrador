package br.pucgo.ads.projetointegrador.diario_saude.entity;

import java.util.Set;

import org.springframework.beans.BeanUtils;
import com.fasterxml.jackson.annotation.JsonIgnore;

import br.pucgo.ads.projetointegrador.diario_saude.dto.PrescricaoMedicaDTO;
import jakarta.persistence.*;

@Entity
@Table(name = "ds_prescricao_medica")
public class PrescricaoMedicaEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id_prescricao;

    @Column(nullable = false)
    private String data_prescricao;

    @Column(nullable = true)
    private String observacoes;

    // Relação (M:1) Médico
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_medico", nullable = false)
    @JsonIgnore
    private MedicoEntity medico;

    // Relação (M:1) Usuário
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_usuario", nullable = false)
    @JsonIgnore
    private UsuarioEntity usuario;

    // Relação 1:N com medicamentos
    @OneToMany(mappedBy = "prescricaoMedica", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JsonIgnore
    private Set<PrescricaoMedicamentoEntity> prescricoesMedicamentos;

    // Relação 1:N com exames
    @OneToMany(mappedBy = "prescricaoMedica", fetch = FetchType.EAGER) // Adicione EAGER
    private Set<PrescricaoExameEntity> prescricoesExames;

    // Relação 1:N com exercícios recomendados
    @OneToMany(mappedBy = "prescricaoMedica", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JsonIgnore
    private Set<ExercicioRecomendadoEntity> exerciciosRecomendados;

    public PrescricaoMedicaEntity(PrescricaoMedicaDTO dto){
        BeanUtils.copyProperties(dto, this);
    }

    public PrescricaoMedicaEntity(){}

    public long getId_prescricao() { return id_prescricao; }
    public void setId_prescricao(long id_prescricao) { this.id_prescricao = id_prescricao; }

    public String getData_prescricao() { return data_prescricao; }
    public void setData_prescricao(String data_prescricao) { this.data_prescricao = data_prescricao; }

    public String getObservacoes() { return observacoes; }
    public void setObservacoes(String observacoes) { this.observacoes = observacoes; }

    public MedicoEntity getMedico() { return medico; }
    public void setMedico(MedicoEntity medico) { this.medico = medico; }

    public UsuarioEntity getUsuario() { return usuario; }
    public void setUsuario(UsuarioEntity usuario) { this.usuario = usuario; }

    public Set<PrescricaoMedicamentoEntity> getPrescricoesMedicamentos() { return prescricoesMedicamentos; }
    public void setPrescricoesMedicamentos(Set<PrescricaoMedicamentoEntity> prescricoesMedicamentos) { this.prescricoesMedicamentos = prescricoesMedicamentos; }

    public Set<PrescricaoExameEntity> getPrescricoesExames() { return prescricoesExames; }
    public void setPrescricoesExames(Set<PrescricaoExameEntity> prescricoesExames) { this.prescricoesExames = prescricoesExames; }

    public Set<ExercicioRecomendadoEntity> getExerciciosRecomendados() {
        return exerciciosRecomendados;
    }

    public void setExerciciosRecomendados(Set<ExercicioRecomendadoEntity> exerciciosRecomendados) {
        this.exerciciosRecomendados = exerciciosRecomendados;
    }
}
