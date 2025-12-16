package br.pucgo.ads.projetointegrador.DoseCertaApp.dto;

import br.pucgo.ads.projetointegrador.DoseCertaApp.model.RegistroTomada;

import java.time.LocalDate;
import java.time.LocalTime;

public class RegistroTomadaDTO {

    private Long id;
    private LocalDate dataPrevista;
    private LocalTime horarioPrevisto;
    private boolean tomado;

    public RegistroTomadaDTO(RegistroTomada registro) {
        this.id = registro.getId();
        this.dataPrevista = registro.getDataPrevista();
        this.horarioPrevisto = registro.getHorarioPrevisto();
        this.tomado = registro.isTomado();
    }

    public Long getId() { return id; }
    public LocalDate getDataPrevista() { return dataPrevista; }
    public LocalTime getHorarioPrevisto() { return horarioPrevisto; }
    public boolean isTomado() { return tomado; }
}
