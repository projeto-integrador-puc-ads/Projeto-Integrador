package br.pucgo.ads.projetointegrador.diario_saude.entity;

import org.springframework.beans.BeanUtils;
import br.pucgo.ads.projetointegrador.diario_saude.dto.MedicoDTO;
import jakarta.persistence.*;

@Entity
@Table(name = "ds_medico")
public class MedicoEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id_medico;

    @Column(nullable = false)
    private String nome;

    @Column(nullable = false)
    private String local_trabalho;

    public MedicoEntity(){}

    public MedicoEntity(MedicoDTO medico){
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
