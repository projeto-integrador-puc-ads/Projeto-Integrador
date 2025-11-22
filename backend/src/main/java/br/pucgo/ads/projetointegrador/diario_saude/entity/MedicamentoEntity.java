package br.pucgo.ads.projetointegrador.diario_saude.entity;

import org.springframework.beans.BeanUtils;
import br.pucgo.ads.projetointegrador.diario_saude.dto.MedicamentoDTO;
import jakarta.persistence.*;
import java.util.List;


@Entity
@Table(name = "ds_medicamento")
public class MedicamentoEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_medicamento;

    @Column(nullable = false, length = 500)
    private String nome;

    @Column(nullable = false, length = 1000)
    private String principio_ativo;

    @Column(length = 500) // Empresa
    private String empresa;

    @Column(length = 1000) // Classe terapêutica
    private String classe_terapeutica;

    @Column(length = 255) // Número de registro
    private String numero_registro;

    public MedicamentoEntity() {}

    public MedicamentoEntity(String nome, String principio_ativo, String empresa, String classe, String numero_registro) {
        this.nome = nome;
        this.principio_ativo = principio_ativo;
        this.empresa = empresa;
        this.classe_terapeutica = classe;
        this.numero_registro = numero_registro;
    }

    public MedicamentoEntity(MedicamentoDTO dto) {
        BeanUtils.copyProperties(dto, this);
    }

    @OneToMany(mappedBy = "medicamento")
    private List<PrescricaoMedicamentoEntity> prescricoes;

    public List<PrescricaoMedicamentoEntity> getPrescricoes() {
        return prescricoes;
    }

    public void setId_medicamento(Long id_medicamento) {
        this.id_medicamento = id_medicamento;
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
}
