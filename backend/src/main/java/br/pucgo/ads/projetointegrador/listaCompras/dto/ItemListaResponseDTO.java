package br.pucgo.ads.projetointegrador.listaCompras.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ItemListaResponseDTO {

    private Long id;
    private Long ListaId;
    private ProdutoResponseDTO produto;
    private BigDecimal quantidade;
    private Boolean comprado;
    private LocalDateTime createdAt;
}
