package br.pucgo.ads.projetointegrador.eldercare.dto;

import br.pucgo.ads.projetointegrador.eldercare.domain.NivelTreino;
import java.time.LocalDate;
import java.util.List;

public record PlanoDTO(
        Long id, Long idosoId, LocalDate dataCriacao, NivelTreino nivel, String observacoes, List<ItemPlanoDTO> itens
) {}
