package br.pucgo.ads.projetointegrador.diario_saude.entity;

import org.springframework.beans.BeanUtils;
import br.pucgo.ads.projetointegrador.diario_saude.dto.MedicamentoDTO;
import jakarta.persistence.*;
import java.util.List;


@Entity
@Table(name = "medicamento")
public class MedicamentoEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id_medicamento;

    @Column(nullable = false)
    private String nome;

    @Column(nullable = false)
    private String principio_ativo;

    @Column(nullable = false)
    private String concentracao;

    @Column(nullable = false)
    private String via_administracao;

    @Column(nullable = false)
    private String tipo_receita;

    public MedicamentoEntity(){}

    public MedicamentoEntity(MedicamentoDTO medicamento){
        BeanUtils.copyProperties(medicamento, this);
    }

    @OneToMany(mappedBy = "medicamento")
    private List<PrescricaoMedicamentoEntity> prescricoes;

    public List<PrescricaoMedicamentoEntity> getPrescricoes() {
        return prescricoes;
    }

    public void setPrescricoes(List<PrescricaoMedicamentoEntity> prescricoes) {
        this.prescricoes = prescricoes;
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
