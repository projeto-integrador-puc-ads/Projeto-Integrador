package br.pucgo.ads.projetointegrador.diario_saude.dto;

import org.springframework.beans.BeanUtils;
import br.pucgo.ads.projetointegrador.diario_saude.entity.PrescricaoExercicioEntity;

public class PrescricaoExercicioDTO {

    private long id_prescricao_exercicio;
    private long id_prescricao;
    private long id_exercicio;

    public PrescricaoExercicioDTO(){}

    public PrescricaoExercicioDTO(PrescricaoExercicioEntity entity){
        BeanUtils.copyProperties(entity, this);
        this.id_prescricao = entity.getPrescricaoMedica().getId_prescricao();
        this.id_exercicio = entity.getExercicio().getId_exercicio();
    }

    public long getId_prescricao_exercicio() {
        return id_prescricao_exercicio;
    }

    public void setId_prescricao_exercicio(long id_prescricao_exercicio) {
        this.id_prescricao_exercicio = id_prescricao_exercicio;
    }

    public long getId_prescricao() {
        return id_prescricao;
    }

    public void setId_prescricao(long id_prescricao) {
        this.id_prescricao = id_prescricao;
    }

    public long getId_exercicio() {
        return id_exercicio;
    }

    public void setId_exercicio(long id_exercicio) {
        this.id_exercicio = id_exercicio;
    }
}
