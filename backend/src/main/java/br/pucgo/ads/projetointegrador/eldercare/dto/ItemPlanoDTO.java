package br.pucgo.ads.projetointegrador.eldercare.dto;

import java.util.UUID;

/** item do plano agrupado por dia/ordem; diaSemana pode ser nulo se o campo for textual. */
public record ItemPlanoDTO(
        String dataOuOrdem,   // vem de ex_dia_plano.data_ou_ordem (texto)
        Integer ordem,        // ordem do item dentro do dia
        UUID exercicioId,
        String exercicioNome,
        Integer series,
        Integer repeticoes,
        Integer duracaoSeg
) {}
