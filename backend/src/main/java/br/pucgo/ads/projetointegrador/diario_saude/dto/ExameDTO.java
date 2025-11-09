package br.pucgo.ads.projetointegrador.diario_saude.dto;

import org.springframework.beans.BeanUtils;
import br.pucgo.ads.projetointegrador.diario_saude.entity.ExameEntity;

public class ExameDTO {

    private long id_exame;
    private String nome_exame;

    public ExameDTO(){}

    public ExameDTO(ExameEntity exame){
        BeanUtils.copyProperties(exame, this);
    }

    public long getId_exame() {
        return id_exame;
    }

    public void setId_exame(long id_exame) {
        this.id_exame = id_exame;
    }

    public String getNome_exame() {
        return nome_exame;
    }

    public void setNome_exame(String nome_exame) {
        this.nome_exame = nome_exame;
    }
}
