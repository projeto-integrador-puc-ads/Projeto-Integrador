package br.pucgo.ads.projetointegrador.diario_saude.dto;

import org.springframework.beans.BeanUtils;
import br.pucgo.ads.projetointegrador.diario_saude.entity.MedicamentoEntity;

public class MedicamentoDTO {

    private long id_medicamento;
    private String nome;
    private String principio_ativo;
    private String concentracao;
    private String via_administracao;
    private String tipo_receita;

    public MedicamentoDTO(){}

    public MedicamentoDTO(MedicamentoEntity medicamento){
        BeanUtils.copyProperties(medicamento, this);
    }

    public long getId_medicamento() {
        return id_medicamento;
    }

    public void setId_medicamento(long id_medicamento) {
        this.id_medicamento = id_medicamento;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getPrincipio_ativo() {
        return principio_ativo;
    }

    public void setPrincipio_ativo(String principio_ativo) {
        this.principio_ativo = principio_ativo;
    }

    public String getConcentracao() {
        return concentracao;
    }

    public void setConcentracao(String concentracao) {
        this.concentracao = concentracao;
    }

    public String getVia_administracao() {
        return via_administracao;
    }

    public void setVia_administracao(String via_administracao) {
        this.via_administracao = via_administracao;
    }

    public String getTipo_receita() {
        return tipo_receita;
    }

    public void setTipo_receita(String tipo_receita) {
        this.tipo_receita = tipo_receita;
    }
}
