package br.pucgo.ads.projetointegrador.DoseCertaApp.dto;

import java.util.List;

public class MedicamentoUpdateDTO {

    private String tipoDosagem;
    private Integer doseDiaria;

    private Integer quantidadeCartela;
    private Double totalFrasco;

    private String tarja; // ✔ agora String

    private Long anvisaId;

    private List<Long> contatosEmergenciaIds;

    private List<HorarioDTO> horarios;

    public String getTipoDosagem() {
        return tipoDosagem;
    }

    public void setTipoDosagem(String tipoDosagem) {
        this.tipoDosagem = tipoDosagem;
    }

    public Integer getDoseDiaria() {
        return doseDiaria;
    }

    public void setDoseDiaria(Integer doseDiaria) {
        this.doseDiaria = doseDiaria;
    }

    public Integer getQuantidadeCartela() {
        return quantidadeCartela;
    }

    public void setQuantidadeCartela(Integer quantidadeCartela) {
        this.quantidadeCartela = quantidadeCartela;
    }

    public Double getTotalFrasco() {
        return totalFrasco;
    }

    public void setTotalFrasco(Double totalFrasco) {
        this.totalFrasco = totalFrasco;
    }

    public String getTarja() {  // ✔ agora String
        return tarja;
    }

    public void setTarja(String tarja) {  // ✔ setter String
        this.tarja = tarja;
    }

    public Long getAnvisaId() {
        return anvisaId;
    }

    public void setAnvisaId(Long anvisaId) {
        this.anvisaId = anvisaId;
    }

    public List<Long> getContatosEmergenciaIds() {
        return contatosEmergenciaIds;
    }

    public void setContatosEmergenciaIds(List<Long> contatosEmergenciaIds) {
        this.contatosEmergenciaIds = contatosEmergenciaIds;
    }

    public List<HorarioDTO> getHorarios() {
        return horarios;
    }

    public void setHorarios(List<HorarioDTO> horarios) {
        this.horarios = horarios;
    }
}
