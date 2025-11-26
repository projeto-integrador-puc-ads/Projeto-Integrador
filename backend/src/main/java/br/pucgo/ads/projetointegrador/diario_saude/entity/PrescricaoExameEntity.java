package br.pucgo.ads.projetointegrador.diario_saude.entity;

import org.springframework.beans.BeanUtils;
import br.pucgo.ads.projetointegrador.diario_saude.dto.PrescricaoExameDTO;
import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
@Table(name = "ds_prescricao_exame")
public class PrescricaoExameEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id_prescricao_exame;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_exame", nullable = false)
    private ExameEntity exame;

    @ManyToOne
    @JoinColumn(name = "id_prescricao", nullable = false)
    private PrescricaoMedicaEntity prescricaoMedica;


    @Column(nullable = false)
    private LocalDate data_prescricao;

    @Column(columnDefinition = "TEXT")
    private String observacao;

    public PrescricaoExameEntity(PrescricaoExameDTO dto){
        BeanUtils.copyProperties(dto, this);
    }

    public PrescricaoExameEntity(){}

    public long getId_prescricao_exame() {
        return id_prescricao_exame;
    }

    public void setId_prescricao_exame(long id_prescricao_exame) {
        this.id_prescricao_exame = id_prescricao_exame;
    }

    public ExameEntity getExame() {
        return exame;
    }

    public void setExame(ExameEntity exame) {
        this.exame = exame;
    }

    public LocalDate getData_prescricao() {
        return data_prescricao;
    }

    public void setData_prescricao(LocalDate data_prescricao) {
        this.data_prescricao = data_prescricao;
    }

    public String getObservacao() {
        return observacao;
    }

    public void setObservacao(String observacao) {
        this.observacao = observacao;
    }

    public PrescricaoMedicaEntity getPrescricaoMedica() {
        return prescricaoMedica;
    }

    public void setPrescricaoMedica(PrescricaoMedicaEntity prescricaoMedica) {
        this.prescricaoMedica = prescricaoMedica;
    }
}
