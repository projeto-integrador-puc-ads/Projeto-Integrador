package br.pucgo.ads.projetointegrador.diario_saude.entity;

import org.springframework.beans.BeanUtils;

import br.pucgo.ads.projetointegrador.diario_saude.dto.PrescricaoMedicamentoDTO;
import jakarta.persistence.*;

@Entity
@Table(name = "ds_prescricao_medicamento")
public class PrescricaoMedicamentoEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id_prescricao_medicamento;

    @Column(nullable = false)
    private String dosagem;

    @Column(nullable = false)
    private String frequencia;

    @Column(nullable = false)
    private String nome_medicamento;
    @Column(nullable = false)
    private String concentracao;

    @Column(nullable = false)
    private String via;

    @ManyToOne
    @JoinColumn(name = "id_medicamento")
    private MedicamentoEntity medicamento;

    @ManyToOne
    @JoinColumn(name = "id_prescricao", nullable = false)
    private PrescricaoMedicaEntity prescricaoMedica;

    public PrescricaoMedicamentoEntity() {}

    public PrescricaoMedicamentoEntity(PrescricaoMedicamentoDTO dto) {
        BeanUtils.copyProperties(dto, this);
        this.nome_medicamento = dto.getNome_medicamento();
        this.concentracao = dto.getConcentracao();
        this.via = dto.getVia();
    }

    // getters e setters
    public long getId_prescricao_medicamento() { return id_prescricao_medicamento; }
    public void setId_prescricao_medicamento(long id_prescricao_medicamento) { this.id_prescricao_medicamento = id_prescricao_medicamento; }

    public String getDosagem() { return dosagem; }
    public void setDosagem(String dosagem) { this.dosagem = dosagem; }

    public String getFrequencia() { return frequencia; }
    public void setFrequencia(String frequencia) { this.frequencia = frequencia; }

    public String getNome_medicamento() { return nome_medicamento; }
    public void setNome_medicamento(String nome_medicamento) { this.nome_medicamento = nome_medicamento; }

    public String getConcentracao() { return concentracao; }
    public void setConcentracao(String concentracao) { this.concentracao = concentracao; }

    public String getVia() { return via; }
    public void setVia(String via) { this.via = via; }

    public MedicamentoEntity getMedicamento() { return medicamento; }
    public void setMedicamento(MedicamentoEntity medicamento) { this.medicamento = medicamento; }

    public PrescricaoMedicaEntity getPrescricaoMedica() { return prescricaoMedica; }
    public void setPrescricaoMedica(PrescricaoMedicaEntity prescricaoMedica) { this.prescricaoMedica = prescricaoMedica; }
}

