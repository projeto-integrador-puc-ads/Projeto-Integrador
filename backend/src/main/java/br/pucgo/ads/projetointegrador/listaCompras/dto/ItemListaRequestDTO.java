package br.pucgo.ads.projetointegrador.listaCompras.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class ItemListaRequestDTO {

    @NotNull
    private Long ListaId;

    @NotNull
    private Long produtoId;


    @NotNull(message = "A quantidade é obrigatória")
    @Positive(message = "A quantidade deve ser maior que zero")
    private BigDecimal quantidade;

    private Boolean comprado = false;
}
