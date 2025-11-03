package br.pucgo.ads.projetointegrador.listaCompras.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProdutoResponseDTO {

    private Long id;
    private String descricao;
    private String nome;
    private String unidadeMedida;
    private CategoriaResponseDTO categoria;
    private LocalDateTime dataCriacao;
    private LocalDateTime dataAtualizacao;
}
