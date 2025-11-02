package br.pucgo.ads.projetointegrador.diario_saude.dto;

import org.springframework.beans.BeanUtils;
import br.pucgo.ads.projetointegrador.diario_saude.entity.MedicoEntity;

public class MedicoDTO {

    private long id_medico;
    private String nome;
    private String local_trabalho;

    public MedicoDTO(){}

    public MedicoDTO(MedicoEntity medico){
        BeanUtils.copyProperties(medico, this);
    }

    public long getId_medico() {
        return id_medico;
    }
    public void setId_medico(long id_medico) {
        this.id_medico = id_medico;
    }

    public String getNome() {
        return nome;
    }
    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getLocal_trabalho() {
        return local_trabalho;
    }
    public void setLocal_trabalho(String local_trabalho) {
        this.local_trabalho = local_trabalho;
    }
}
