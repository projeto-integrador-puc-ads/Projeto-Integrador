package br.pucgo.ads.projetointegrador.DoseCertaApp.dto;


import br.pucgo.ads.projetointegrador.DoseCertaApp.model.TarjaTipo;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.NotBlank;

import java.time.LocalDate;
import java.time.LocalTime;

public class MedicamentoFromAnvisaDTO {

    @NotNull(message = "O ID do medicamento vindo da ANVISA é obrigatório.")
    private Long medicamentoAnvisaId;

    @NotNull(message = "O ID do usuário é obrigatório.")
    private Long usuarioId;

    @NotNull(message = "O valor da dosagem é obrigatório.")
    private Double dosagemValor;

    @NotBlank(message = "O tipo da dosagem é obrigatório. Ex: mg, ml, comprimidos.")
    private String dosagemTipo;

    @NotNull(message = "A quantidade por dose é obrigatória.")
    private Integer quantidadePorDose = 1;

    @NotNull(message = "O horário é obrigatório.")
    @JsonFormat(pattern = "HH:mm")
    private LocalTime horario;

    @NotNull(message = "A data de início é obrigatória.")
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate dataInicio;

    @NotNull(message = "A data de fim é obrigatória.")
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate dataFim;

    // NOVO CAMPO TARJA (ENUM)
    private TarjaTipo tarja = TarjaTipo.SEM_TARJA;

    private Boolean urgencia = false;

    private Long contatoEmergenciaId;


    public MedicamentoFromAnvisaDTO() {}


    public Long getMedicamentoAnvisaId() { return medicamentoAnvisaId; }
    public void setMedicamentoAnvisaId(Long medicamentoAnvisaId) { this.medicamentoAnvisaId = medicamentoAnvisaId; }

    public Long getUsuarioId() { return usuarioId; }
    public void setUsuarioId(Long usuarioId) { this.usuarioId = usuarioId; }

    public Double getDosagemValor() { return dosagemValor; }
    public void setDosagemValor(Double dosagemValor) { this.dosagemValor = dosagemValor; }

    public String getDosagemTipo() { return dosagemTipo; }
    public void setDosagemTipo(String dosagemTipo) { this.dosagemTipo = dosagemTipo; }

    public Integer getQuantidadePorDose() { return quantidadePorDose; }
    public void setQuantidadePorDose(Integer quantidadePorDose) { this.quantidadePorDose = quantidadePorDose; }

    public LocalTime getHorario() { return horario; }
    public void setHorario(LocalTime horario) { this.horario = horario; }

    public LocalDate getDataInicio() { return dataInicio; }
    public void setDataInicio(LocalDate dataInicio) { this.dataInicio = dataInicio; }

    public LocalDate getDataFim() { return dataFim; }
    public void setDataFim(LocalDate dataFim) { this.dataFim = dataFim; }

    public TarjaTipo getTarja() { return tarja; }
    public void setTarja(TarjaTipo tarja) { this.tarja = tarja; }

    public Boolean getUrgencia() { return urgencia; }
    public void setUrgencia(Boolean urgencia) { this.urgencia = urgencia; }

    public Long getContatoEmergenciaId() { return contatoEmergenciaId; }
    public void setContatoEmergenciaId(Long contatoEmergenciaId) { this.contatoEmergenciaId = contatoEmergenciaId; }
}
