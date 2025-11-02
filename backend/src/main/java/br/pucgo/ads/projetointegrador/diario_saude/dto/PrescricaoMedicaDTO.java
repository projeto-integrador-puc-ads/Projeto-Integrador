package br.pucgo.ads.projetointegrador.diario_saude.dto;

import org.springframework.beans.BeanUtils;
import br.pucgo.ads.projetointegrador.diario_saude.entity.PrescricaoMedicaEntity;

public class PrescricaoMedicaDTO {

    private long id_prescricao;
    private String data_prescricao;
    private String observacoes;

    private long id_medico;
    private long id_usuario;

    public PrescricaoMedicaDTO(PrescricaoMedicaEntity entity){
        BeanUtils.copyProperties(entity, this);
        this.id_medico = entity.getMedico().getId_medico();
        this.id_usuario = entity.getUsuario().getId_usuario();
    }

    public PrescricaoMedicaDTO(){}

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

    public long getId_medico() {
        return id_medico;
    }

    public void setId_medico(long id_medico) {
        this.id_medico = id_medico;
    }

    public long getId_usuario() {
        return id_usuario;
    }

    public void setId_usuario(long id_usuario) {
        this.id_usuario = id_usuario;
    }
}
