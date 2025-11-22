package br.pucgo.ads.projetointegrador.diario_saude.dto;

import br.pucgo.ads.projetointegrador.diario_saude.entity.PrescricaoMedicamentoEntity;

public class PrescricaoMedicamentoDTO {

    private long id_prescricao_medicamento;
    private String dosagem;
    private String frequencia;

    private String nome_medicamento;
    private String concentracao;
    private String via;

    private long id_medicamento;
    private long id_prescricao;

    public PrescricaoMedicamentoDTO() {}

    public PrescricaoMedicamentoDTO(PrescricaoMedicamentoEntity entity){
        this.id_prescricao_medicamento = entity.getId_prescricao_medicamento();
        this.dosagem = entity.getDosagem();
        this.frequencia = entity.getFrequencia();

        this.nome_medicamento = entity.getMedicamento() != null ? entity.getMedicamento().getNome() : "-";
        this.concentracao = entity.getConcentracao() != null ? entity.getConcentracao() : "-";
        this.via = entity.getVia() != null ? entity.getVia() : "-";

        this.id_medicamento = entity.getMedicamento() != null ? entity.getMedicamento().getId_medicamento() : 0;
        this.id_prescricao = entity.getPrescricaoMedica().getId_prescricao();
    }

    // getters e setters
    public long getId_prescricao_medicamento() { return id_prescricao_medicamento; }
    public void setId_prescricao_medicamento(long id) { this.id_prescricao_medicamento = id; }

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

    public long getId_medicamento() { return id_medicamento; }
    public void setId_medicamento(long id_medicamento) { this.id_medicamento = id_medicamento; }

    public long getId_prescricao() { return id_prescricao; }
    public void setId_prescricao(long id_prescricao) { this.id_prescricao = id_prescricao; }
}
