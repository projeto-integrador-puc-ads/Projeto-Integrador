package br.pucgo.ads.projetointegrador.diario_saude.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "ds_exercicio_recomendado")
public class ExercicioRecomendadoEntity {
    @Id @GeneratedValue
    private long id;

    @Column(columnDefinition = "TEXT")
    private String descricao;

    @ManyToOne
    @JoinColumn(name="id_prescricao")
    private PrescricaoMedicaEntity prescricaoMedica;

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public PrescricaoMedicaEntity getPrescricaoMedica() {
        return prescricaoMedica;
    }

    public void setPrescricaoMedica(PrescricaoMedicaEntity prescricaoMedica) {
        this.prescricaoMedica = prescricaoMedica;
    }
}

