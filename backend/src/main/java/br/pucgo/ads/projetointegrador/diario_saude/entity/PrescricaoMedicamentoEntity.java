package br.pucgo.ads.projetointegrador.diario_saude.entity;

import org.springframework.beans.BeanUtils;

import br.pucgo.ads.projetointegrador.diario_saude.dto.PrescricaoMedicamentoDTO;
import jakarta.persistence.*;

@Entity
@Table(name = "prescricao_medicamento")
public class PrescricaoMedicamentoEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id_prescricao_medicamento;

    @Column(nullable = false)
    private String dosagem;

    @Column(nullable = false)
    private String frequencia;

    // Relação M:1 com Medicamento
    @ManyToOne
    @JoinColumn(name = "id_medicamento", nullable = false)
    private MedicamentoEntity medicamento;

    // Relação M:1 com PrescricaoMedica
    @ManyToOne
    @JoinColumn(name = "id_prescricao", nullable = false)
    private PrescricaoMedicaEntity prescricaoMedica;


    public MedicamentoEntity getMedicamento() {
        return medicamento;
    }

    public void setMedicamento(MedicamentoEntity medicamento) {
        this.medicamento = medicamento;
    }

    public PrescricaoMedicaEntity getPrescricaoMedica() {
        return prescricaoMedica;
    }

    public void setPrescricaoMedica(PrescricaoMedicaEntity prescricaoMedica) {
        this.prescricaoMedica = prescricaoMedica;
    }

    public PrescricaoMedicamentoEntity(PrescricaoMedicamentoDTO dto){
        BeanUtils.copyProperties(dto, this);
    }

    public PrescricaoMedicamentoEntity(){}

    public long getId_prescricao_medicamento() {
        return id_prescricao_medicamento;
    }

    public void setId_prescricao_medicamento(long id_prescricao_medicamento) {
        this.id_prescricao_medicamento = id_prescricao_medicamento;
    }

    public String getDosagem() {
        return dosagem;
    }

    public void setDosagem(String dosagem) {
        this.dosagem = dosagem;
    }

    public String getFrequencia() {
        return frequencia;
    }

    public void setFrequencia(String frequencia) {
        this.frequencia = frequencia;
    }
    
}
