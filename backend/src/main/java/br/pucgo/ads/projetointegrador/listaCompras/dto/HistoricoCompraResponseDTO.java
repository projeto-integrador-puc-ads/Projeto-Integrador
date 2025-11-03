package br.pucgo.ads.projetointegrador.listaCompras.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class HistoricoCompraResponseDTO {

    private Long id;
    private Long usuarioId;
    private ProdutoResponseDTO produtoA;
    private ProdutoResponseDTO produtoB;
    private Integer frequencia;
    private Double confianca;
    private LocalDateTime dataCriacao;
    private LocalDateTime dataAtualizacao;
}
