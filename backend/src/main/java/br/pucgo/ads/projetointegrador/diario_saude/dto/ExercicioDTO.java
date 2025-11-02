package br.pucgo.ads.projetointegrador.diario_saude.dto;

import org.springframework.beans.BeanUtils;
import br.pucgo.ads.projetointegrador.diario_saude.entity.ExercicioEntity;

public class ExercicioDTO {

    private long id_exercicio;
    private String tipo_exercicio;
    private String tempo_ou_quantidade;
    private String observacoes;

    public ExercicioDTO() {}

    public ExercicioDTO(ExercicioEntity entity) {
        BeanUtils.copyProperties(entity, this);
    }

    public long getId_exercicio() {
        return id_exercicio;
    }

    public void setId_exercicio(long id_exercicio) {
        this.id_exercicio = id_exercicio;
    }

    public String getTipo_exercicio() {
        return tipo_exercicio;
    }

    public void setTipo_exercicio(String tipo_exercicio) {
        this.tipo_exercicio = tipo_exercicio;
    }

    public String getTempo_ou_quantidade() {
        return tempo_ou_quantidade;
    }

    public void setTempo_ou_quantidade(String tempo_ou_quantidade) {
        this.tempo_ou_quantidade = tempo_ou_quantidade;
    }

    public String getObservacoes() {
        return observacoes;
    }

    public void setObservacoes(String observacoes) {
        this.observacoes = observacoes;
    }
}
