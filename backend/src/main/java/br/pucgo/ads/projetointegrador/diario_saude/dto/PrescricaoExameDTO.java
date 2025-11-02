package br.pucgo.ads.projetointegrador.diario_saude.dto;

import java.time.LocalDate;

public record PrescricaoExameDTO(long id_exame, long id_prescricao_medica, LocalDate data_prescricao, String observacao) {

}
