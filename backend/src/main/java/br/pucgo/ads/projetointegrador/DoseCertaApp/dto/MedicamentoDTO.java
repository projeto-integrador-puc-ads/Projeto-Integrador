package br.pucgo.ads.projetointegrador.DoseCertaApp.dto;

import br.pucgo.ads.projetointegrador.DoseCertaApp.model.TarjaTipo;
import java.util.List;

public class MedicamentoDTO {

    private Long id;
    private String nome;              // nome local
    private String nomeAnvisa;        // nome vindo da tabela ANVISA

    private String dosagemTipo;
    private Double dosagemValor;
    private Integer quantidadePorDose;

    private List<HorarioDTO> horarios;

    private TarjaTipo tarja;

    private Boolean urgencia;
    private Boolean avisarContato;
    private Long contatoEmergenciaId;
    private Long usuarioId;

    private List<String> checkins;

    public MedicamentoDTO() {}

    // Getters e Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public String getNomeAnvisa() { return nomeAnvisa; }
    public void setNomeAnvisa(String nomeAnvisa) { this.nomeAnvisa = nomeAnvisa; }

    public String getDosagemTipo() { return dosagemTipo; }
    public void setDosagemTipo(String dosagemTipo) { this.dosagemTipo = dosagemTipo; }

    public Double getDosagemValor() { return dosagemValor; }
    public void setDosagemValor(Double dosagemValor) { this.dosagemValor = dosagemValor; }

    public Integer getQuantidadePorDose() { return quantidadePorDose; }
    public void setQuantidadePorDose(Integer quantidadePorDose) { this.quantidadePorDose = quantidadePorDose; }

    public List<HorarioDTO> getHorarios() { return horarios; }
    public void setHorarios(List<HorarioDTO> horarios) { this.horarios = horarios; }

    public TarjaTipo getTarja() { return tarja; }
    public void setTarja(TarjaTipo tarja) { this.tarja = tarja; }

    public Boolean getUrgencia() { return urgencia; }
    public void setUrgencia(Boolean urgencia) { this.urgencia = urgencia; }

    public Boolean getAvisarContato() { return avisarContato; }
    public void setAvisarContato(Boolean avisarContato) { this.avisarContato = avisarContato; }

    public Long getContatoEmergenciaId() { return contatoEmergenciaId; }
    public void setContatoEmergenciaId(Long contatoEmergenciaId) { this.contatoEmergenciaId = contatoEmergenciaId; }

    public Long getUsuarioId() { return usuarioId; }
    public void setUsuarioId(Long usuarioId) { this.usuarioId = usuarioId; }

    public List<String> getCheckins() { return checkins; }
    public void setCheckins(List<String> checkins) { this.checkins = checkins; }
}
