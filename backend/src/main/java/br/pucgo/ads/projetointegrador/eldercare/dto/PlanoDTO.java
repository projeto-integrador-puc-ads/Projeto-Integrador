package br.pucgo.ads.projetointegrador.eldercare.dto;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

/** DTO de saída do plano (ex_plano + ex_dia_plano + ex_item_plano). */
public record PlanoDTO(
        UUID id,
        UUID participanteId,
        LocalDate mes,
        String objetivo,
        String nivel,
        Integer freqSemana,
        Integer tempoSessaoMin,
        List<ItemPlanoDTO> itens
) {}
