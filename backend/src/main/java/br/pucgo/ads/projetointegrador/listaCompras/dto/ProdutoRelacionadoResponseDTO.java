package br.pucgo.ads.projetointegrador.listaCompras.dto;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProdutoRelacionadoResponseDTO {

    private Long produtoId;
    private Long similarId;
    private ProdutoResponseDTO produtoSimilar;
    private BigDecimal afinidade;
    private LocalDateTime atualizadoEm;
}
