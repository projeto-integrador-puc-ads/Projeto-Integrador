package br.pucgo.ads.projetointegrador.eldercare.dto;

import br.pucgo.ads.projetointegrador.eldercare.domain.Intensidade;
import java.time.DayOfWeek;

public record ItemPlanoDTO(
        DayOfWeek diaSemana, String atividade, Integer duracaoMin, Intensidade intensidade, String observacoes
) {}
