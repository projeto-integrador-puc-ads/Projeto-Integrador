package br.pucgo.ads.projetointegrador.diario_saude.entity;

import java.util.List;

import org.springframework.beans.BeanUtils;

import com.fasterxml.jackson.annotation.JsonIgnore;

import br.pucgo.ads.projetointegrador.diario_saude.dto.PrescricaoMedicaDTO;
import jakarta.persistence.*;

@Entity
@Table(name = "prescricao_medica")
public class PrescricaoMedicaEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id_prescricao;

    @Column(nullable = false)
    private String data_prescricao;

    @Column(nullable = true)
    private String observacoes;

    //Relação (M:1) Médico
    @ManyToOne
    @JoinColumn(name = "id_medico", nullable = false)
    @JsonIgnore
    private MedicoEntity medico;

    //Relação (M:1) Usuário
    @ManyToOne
    @JoinColumn(name = "id_usuario", nullable = false)
    @JsonIgnore
    private UsuarioEntity usuario;

    //Relações 1:N com prescricoes
    @OneToMany(mappedBy = "prescricaoMedica")
    @JsonIgnore
    private List<PrescricaoMedicamentoEntity> prescricoesMedicamentos;

    @OneToMany(mappedBy = "prescricaoMedica")
    @JsonIgnore
    private List<PrescricaoExameEntity> prescricoesExames;

    public PrescricaoMedicaEntity(PrescricaoMedicaDTO dto){
        BeanUtils.copyProperties(dto, this);
    }

    public List<PrescricaoMedicamentoEntity> getPrescricoesMedicamentos() {
        return prescricoesMedicamentos;
    }

    public void setPrescricoesMedicamentos(List<PrescricaoMedicamentoEntity> prescricoesMedicamentos) {
        this.prescricoesMedicamentos = prescricoesMedicamentos;
    }

    public List<PrescricaoExameEntity> getPrescricoesExames() {
        return prescricoesExames;
    }

    public void setPrescricoesExames(List<PrescricaoExameEntity> prescricoesExames) {
        this.prescricoesExames = prescricoesExames;
    }

    public PrescricaoMedicaEntity(){}

    public long getId_prescricao() {
        return id_prescricao;
    }

    public void setId_prescricao(long id_prescricao) {
        this.id_prescricao = id_prescricao;
    }

    public String getData_prescricao() {
        return data_prescricao;
    }

    public void setData_prescricao(String data_prescricao) {
        this.data_prescricao = data_prescricao;
    }

    public String getObservacoes() {
        return observacoes;
    }

    public void setObservacoes(String observacoes) {
        this.observacoes = observacoes;
    }

    public MedicoEntity getMedico() {
        return medico;
    }

    public void setMedico(MedicoEntity medico) {
        this.medico = medico;
    }

    public UsuarioEntity getUsuario() {
        return usuario;
    }

    public void setUsuario(UsuarioEntity usuario) {
        this.usuario = usuario;
    }
}
