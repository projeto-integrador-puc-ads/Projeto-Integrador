package br.pucgo.ads.projetointegrador.eldercare.mapper;

import br.pucgo.ads.projetointegrador.eldercare.domain.*;
import br.pucgo.ads.projetointegrador.eldercare.dto.*;

public final class EldercareMapper {
    private EldercareMapper() {}

    public static IdosoDTO toDTO(Idoso e) {
        return new IdosoDTO(e.getId(), e.getNome(), e.getDataNascimento(), e.getSexo(), e.getEmail(), e.getTelefone());
    }

    public static PlanoDTO toDTO(PlanoExercicio p) {
        return new PlanoDTO(
                p.getId(),
                p.getIdoso().getId(),
                p.getDataCriacao(),
                p.getNivel(),
                p.getObservacoes(),
                p.getItens().stream()
                        .map(i -> new ItemPlanoDTO(i.getDiaSemana(), i.getAtividade(), i.getDuracaoMin(), i.getIntensidade(), i.getObservacoes()))
                        .toList()
        );
    }
}
