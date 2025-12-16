package br.pucgo.ads.projetointegrador.DoseCertaApp.dto;

import br.pucgo.ads.projetointegrador.DoseCertaApp.model.RegistroTomada;

public class RegistroTomadaHistoricoDTO {

    private Long id;
    private String medicamentoNome;
    private String horarioPrevisto;
    private String horarioRealTomado;
    private String dataPrevista;

    public RegistroTomadaHistoricoDTO(RegistroTomada r) {
        this.id = r.getId();

        // NOME REAL DO MEDICAMENTO (VEM DA ANVISA)
        this.medicamentoNome =
                r.getMedicamento().getMedicamentoAnvisa().getNomeProduto();

        this.horarioPrevisto =
                r.getHorarioPrevisto() != null ? r.getHorarioPrevisto().toString() : null;

        this.horarioRealTomado =
                r.getHorarioRealTomado() != null ? r.getHorarioRealTomado().toString() : null;

        this.dataPrevista =
                r.getDataPrevista() != null ? r.getDataPrevista().toString() : null;
    }

    public Long getId() { return id; }
    public String getMedicamentoNome() { return medicamentoNome; }
    public String getHorarioPrevisto() { return horarioPrevisto; }
    public String getHorarioRealTomado() { return horarioRealTomado; }
    public String getDataPrevista() { return dataPrevista; }
}
