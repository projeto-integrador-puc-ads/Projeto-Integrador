package br.pucgo.ads.projetointegrador.DoseCertaApp.dto;

import br.pucgo.ads.projetointegrador.DoseCertaApp.model.Medicamento;
import br.pucgo.ads.projetointegrador.DoseCertaApp.model.MedicamentoHorario;
import br.pucgo.ads.projetointegrador.DoseCertaApp.model.RegistroTomada;

import java.util.List;
import java.util.stream.Collectors;

public class MedicamentoResponseDTO {

    private Long id;
    private String nome;
    private String tarja;

    private Boolean contatarEmergencia; // 🔥 ADICIONADO

    private List<MedicamentoHorarioDTO> horarios;

    public MedicamentoResponseDTO(Medicamento medicamento,
                                  List<MedicamentoHorario> horarios,
                                  List<RegistroTomada> registrosDia) {

        this.id = medicamento.getId();
        this.nome = medicamento.getMedicamentoAnvisa().getNomeProduto();
        this.tarja = medicamento.getTarja().name();

        // 🔥 IMPORTANTE → ENVIAR PRO FRONT
        this.contatarEmergencia = medicamento.getContatarEmergencia();

        this.horarios = horarios.stream().map(h -> {
            RegistroTomada registro = registrosDia.stream()
                    .filter(r -> r.getHorarioMedicamento().getId().equals(h.getId()))
                    .findFirst()
                    .orElse(null);

            return new MedicamentoHorarioDTO(h, registro);
        }).collect(Collectors.toList());
    }

    public Long getId() { return id; }
    public String getNome() { return nome; }
    public String getTarja() { return tarja; }

    // 🔥 GETTER NECESSÁRIO PARA O FRONT
    public Boolean getContatarEmergencia() {
        return contatarEmergencia;
    }

    public List<MedicamentoHorarioDTO> getHorarios() { return horarios; }
}
