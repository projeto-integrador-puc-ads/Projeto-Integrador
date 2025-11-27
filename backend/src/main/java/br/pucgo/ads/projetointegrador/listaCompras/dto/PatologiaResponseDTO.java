package br.pucgo.ads.projetointegrador.listaCompras.dto;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PatologiaResponseDTO {
    private Long id;
    private String nome;
    private String descricao;
}
