package br.pucgo.ads.projetointegrador.listaCompras.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ItemListaResponseDTO {

    private Long id;
    private Long compraListaId;
    private ProdutoResponseDTO produto;
    private Double quantidade;
    private Boolean comprado;
    private LocalDateTime dataCriacao;
    private LocalDateTime dataAtualizacao;
}
