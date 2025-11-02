package br.pucgo.ads.projetointegrador.diario_saude.entity;

import org.springframework.beans.BeanUtils;
import br.pucgo.ads.projetointegrador.diario_saude.dto.ExameDTO;
import jakarta.persistence.*;
import java.util.List;


@Entity
@Table(name = "exame")
public class ExameEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id_exame;

    @Column(nullable = false)
    private String nome_exame;

    private String data_solicitacao;

    private String imagem_resultado;

    public ExameEntity(){}

    public ExameEntity(ExameDTO exame){
        BeanUtils.copyProperties(exame, this);
    }

    @OneToMany(mappedBy = "exame")
    private List<PrescricaoExameEntity> prescricoes;

    public List<PrescricaoExameEntity> getPrescricoes() {
        return prescricoes;
    }

    public void setPrescricoes(List<PrescricaoExameEntity> prescricoes) {
        this.prescricoes = prescricoes;
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

    public String getData_solicitacao() {
        return data_solicitacao;
    }

    public void setData_solicitacao(String data_solicitacao) {
        this.data_solicitacao = data_solicitacao;
    }

    public String getImagem_resultado() {
        return imagem_resultado;
    }

    public void setImagem_resultado(String imagem_resultado) {
        this.imagem_resultado = imagem_resultado;
    }
}
