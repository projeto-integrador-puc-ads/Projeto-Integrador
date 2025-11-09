package br.pucgo.ads.projetointegrador.diario_saude.dto;

import org.springframework.beans.BeanUtils;
import br.pucgo.ads.projetointegrador.diario_saude.entity.MedicamentoEntity;

public class MedicamentoDTO {

    private Long id_medicamento;
    private String nome;
    private String principio_ativo;
    private String empresa;
    private String classe_terapeutica;
    private String numero_registro;

    public MedicamentoDTO() {}

    public MedicamentoDTO(MedicamentoEntity medicamento){
        BeanUtils.copyProperties(medicamento, this);
    }

    public Long getId_medicamento() {
        return id_medicamento;
    }

    public void setId_medicamento(Long id_medicamento) {
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

    public String getEmpresa() {
        return empresa;
    }

    public void setEmpresa(String empresa) {
        this.empresa = empresa;
    }

    public String getClasse_terapeutica() {
        return classe_terapeutica;
    }

    public void setClasse_terapeutica(String classe_terapeutica) {
        this.classe_terapeutica = classe_terapeutica;
    }

    public String getNumero_registro() {
        return numero_registro;
    }

    public void setNumero_registro(String numero_registro) {
        this.numero_registro = numero_registro;
    }
}
