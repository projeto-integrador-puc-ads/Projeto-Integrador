package br.pucgo.ads.projetointegrador.diario_saude.dto;

import org.springframework.beans.BeanUtils;
import br.pucgo.ads.projetointegrador.diario_saude.entity.PrescricaoMedicamentoEntity;

public class PrescricaoMedicamentoDTO {

    private long id_prescricao_medicamento;
    private String dosagem;
    private String frequencia;

    private long id_medicamento;
    private long id_prescricao;

    public PrescricaoMedicamentoDTO(PrescricaoMedicamentoEntity entity){
        BeanUtils.copyProperties(entity, this);
        this.id_medicamento = entity.getMedicamento().getId_medicamento();
        this.id_prescricao = entity.getPrescricaoMedica().getId_prescricao();
    }

    public PrescricaoMedicamentoDTO(){}

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

    public long getId_medicamento() {
        return id_medicamento;
    }

    public void setId_medicamento(long id_medicamento) {
        this.id_medicamento = id_medicamento;
    }

    public long getId_prescricao() {
        return id_prescricao;
    }

    public void setId_prescricao(long id_prescricao) {
        this.id_prescricao = id_prescricao;
    }
}
