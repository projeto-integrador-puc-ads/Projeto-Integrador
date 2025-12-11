package br.pucgo.ads.projetointegrador.remember.dto.conquista;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RankingResponseDTO {
    private String nomeUsuario;
    private Long totalPontos;
}
