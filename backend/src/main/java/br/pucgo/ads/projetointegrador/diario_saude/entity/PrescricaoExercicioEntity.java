package br.pucgo.ads.projetointegrador.diario_saude.entity;

import org.springframework.beans.BeanUtils;
import br.pucgo.ads.projetointegrador.diario_saude.dto.PrescricaoExercicioDTO;
import jakarta.persistence.*;

@Entity
@Table(name = "prescricao_exercicio")
public class PrescricaoExercicioEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id_prescricao_exercicio;

    @ManyToOne
    @JoinColumn(name = "id_prescricao", nullable = false)
    private PrescricaoMedicaEntity prescricaoMedica;

    @ManyToOne
    @JoinColumn(name = "id_exercicio", nullable = false)
    private ExercicioEntity exercicio;

    public PrescricaoExercicioEntity(){}

    public PrescricaoExercicioEntity(PrescricaoExercicioDTO dto){
        BeanUtils.copyProperties(dto, this);
    }

    public long getId_prescricao_exercicio() {
        return id_prescricao_exercicio;
    }

    public void setId_prescricao_exercicio(long id_prescricao_exercicio) {
        this.id_prescricao_exercicio = id_prescricao_exercicio;
    }

    public PrescricaoMedicaEntity getPrescricaoMedica() {
        return prescricaoMedica;
    }

    public void setPrescricaoMedica(PrescricaoMedicaEntity prescricaoMedica) {
        this.prescricaoMedica = prescricaoMedica;
    }

    public ExercicioEntity getExercicio() {
        return exercicio;
    }

    public void setExercicio(ExercicioEntity exercicio) {
        this.exercicio = exercicio;
    }
}
