package br.pucgo.ads.projetointegrador.diario_saude.dto;

import java.time.LocalDate;

import br.pucgo.ads.projetointegrador.diario_saude.entity.PrescricaoExameEntity;

public class PrescricaoExameDTO {

    private long id_prescricao_exame;
    private long id_exame;
    private long id_prescricao_medica; 
    
    private String nome_exame; 
    
    private LocalDate data_prescricao;
    private String observacao;

    // Construtor para mapear a Entity (OUTPUT - USADO NO HISTÓRICO)
    public PrescricaoExameDTO(PrescricaoExameEntity entity) {
        this.id_prescricao_exame = entity.getId_prescricao_exame();

        this.data_prescricao = entity.getData_prescricao();
        this.observacao = entity.getObservacao();
        
        if (entity.getExame() != null) {
            this.id_exame = entity.getExame().getId_exame();
            this.nome_exame = entity.getExame().getNome_exame();
        } else {
            this.nome_exame = "Exame Desconhecido (Falha de Mapeamento)";
        }
    }

    // Construtor vazio (necessário para receber dados de INPUT)
    public PrescricaoExameDTO() {}

    // --- Getters e Setters ---

    // ... (id_prescricao_exame, id_exame, nome_exame, data_prescricao, observacao)

    public long getId_prescricao_medica() {
        return id_prescricao_medica;
    }

    public void setId_prescricao_medica(long id_prescricao_medica) {
        this.id_prescricao_medica = id_prescricao_medica;
    }
    

    public long getId_prescricao_exame() {
        return id_prescricao_exame;
    }

    public void setId_prescricao_exame(long id_prescricao_exame) {
        this.id_prescricao_exame = id_prescricao_exame;
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

    public LocalDate getData_prescricao() {
        return data_prescricao;
    }

    public void setData_prescricao(LocalDate data_prescricao) {
        this.data_prescricao = data_prescricao;
    }

    public String getObservacao() {
        return observacao;
    }

    public void setObservacao(String observacao) {
        this.observacao = observacao;
    }
}