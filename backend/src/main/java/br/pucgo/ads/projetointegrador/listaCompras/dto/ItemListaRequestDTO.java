package br.pucgo.ads.projetointegrador.listaCompras.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class ItemListaRequestDTO {

    @NotNull
    private Long compraListaId;

    @NotNull
    private Long produtoId;


    @NotNull(message = "A quantidade é obrigatória")
    @Positive
    private Double quantidade;

    private Boolean comprado = false;
}
