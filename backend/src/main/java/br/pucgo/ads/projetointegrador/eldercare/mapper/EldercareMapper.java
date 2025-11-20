package br.pucgo.ads.projetointegrador.eldercare.mapper;

import br.pucgo.ads.projetointegrador.eldercare.domain.ex_plano;
import br.pucgo.ads.projetointegrador.eldercare.domain.ex_dia_plano;
import br.pucgo.ads.projetointegrador.eldercare.domain.ex_item_plano;
import br.pucgo.ads.projetointegrador.eldercare.dto.ItemPlanoDTO;
import br.pucgo.ads.projetointegrador.eldercare.dto.PlanoDTO;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public final class EldercareMapper {
    private EldercareMapper() {}

    public static PlanoDTO toDTO(ex_plano plano) {
        if (plano == null) return null;

        UUID participanteId = null;
        if (plano.getParticipante() != null) {
            participanteId = plano.getParticipante().getId();
        } else if (plano.getRespostaQuestionario() != null
                && plano.getRespostaQuestionario().getParticipante() != null) {
            participanteId = plano.getRespostaQuestionario().getParticipante().getId();
        }

        List<ItemPlanoDTO> itens = new ArrayList<>();
        if (plano.getDias() != null) {
            for (ex_dia_plano dia : plano.getDias()) {
                String dataOuOrdem = dia.getDataOuOrdem(); // TEXT no DER
                if (dia.getItens() != null) {
                    for (ex_item_plano it : dia.getItens()) {
                        UUID exId = (it.getExercicio() != null) ? it.getExercicio().getId() : null;
                        String exNome = (it.getExercicio() != null) ? it.getExercicio().getNome() : null;

                        itens.add(new ItemPlanoDTO(
                                dataOuOrdem,
                                it.getOrdem(),
                                exId,
                                exNome,
                                it.getSeries(),
                                it.getRepeticoes(),
                                it.getDuracaoSeg()
                        ));
                    }
                }
            }
        }

        return new PlanoDTO(
                plano.getId(),
                participanteId,
                plano.getMes(),
                plano.getObjetivo(),
                plano.getNivel(),
                plano.getFreqSemana(),
                plano.getTempoSessaoMin(),
                itens
        );
    }
}
