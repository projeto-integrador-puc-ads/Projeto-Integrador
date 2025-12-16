package br.pucgo.ads.projetointegrador.DoseCertaApp.dto;

import br.pucgo.ads.projetointegrador.DoseCertaApp.model.TarjaTipo;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public class MedicamentoCreateDTO {

    @NotNull
    private Long usuarioId;

    private String tipoDosagem;          // "mg" ou "ml"
    private Integer doseDiaria;          // quantidade por dose
    private Integer quantidadeCartela;   // comprimidos
    private Double totalFrasco;          // ml

    private TarjaTipo tarja;             // PRETA / VERMELHA / AMARELA / SEM_TARJA

    // AGORA SUPORTA VÁRIOS CONTATOS
    private List<Long> contatosEmergenciaIds;

    private List<HorarioDTO> horarios;   // [{ "horario": "08:00" }]

    // GETTERS / SETTERS

    public Long getUsuarioId() { return usuarioId; }
    public void setUsuarioId(Long usuarioId) { this.usuarioId = usuarioId; }

    public String getTipoDosagem() { return tipoDosagem; }
    public void setTipoDosagem(String tipoDosagem) { this.tipoDosagem = tipoDosagem; }

    public Integer getDoseDiaria() { return doseDiaria; }
    public void setDoseDiaria(Integer doseDiaria) { this.doseDiaria = doseDiaria; }

    public Integer getQuantidadeCartela() { return quantidadeCartela; }
    public void setQuantidadeCartela(Integer quantidadeCartela) { this.quantidadeCartela = quantidadeCartela; }

    public Double getTotalFrasco() { return totalFrasco; }
    public void setTotalFrasco(Double totalFrasco) { this.totalFrasco = totalFrasco; }

    public TarjaTipo getTarja() { return tarja; }
    public void setTarja(TarjaTipo tarja) { this.tarja = tarja; }

    public List<Long> getContatosEmergenciaIds() { return contatosEmergenciaIds; }
    public void setContatosEmergenciaIds(List<Long> contatosEmergenciaIds) {
        this.contatosEmergenciaIds = contatosEmergenciaIds;
    }

    public List<HorarioDTO> getHorarios() { return horarios; }
    public void setHorarios(List<HorarioDTO> horarios) { this.horarios = horarios; }
}
