package br.pucgo.ads.projetointegrador.DoseCertaApp.dto;

import jakarta.validation.constraints.NotBlank;

public class HorarioDTO {

    @NotBlank
    private String horario;

    public HorarioDTO() {}

    public HorarioDTO(String horario) {
        this.horario = horario;
    }

    public String getHorario() {
        return horario;
    }

    public void setHorario(String horario) {
        this.horario = horario;
    }
}
