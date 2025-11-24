package br.pucgo.ads.projetointegrador.listaCompras.dto;

import br.pucgo.ads.projetointegrador.listaCompras.entity.Categoria;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProdutoResponseDTO {

    private Long id;
    private String nome;
    private String nomeNormalizado;
    private BigDecimal preco;
    private Boolean ativo;
    private Boolean isPersonalizado;
    private String tags;
    private CategoriaResponseDTO categoria;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Campos transient (apenas da API)
    private String descricao;
    private String unidadeMedida;
}
