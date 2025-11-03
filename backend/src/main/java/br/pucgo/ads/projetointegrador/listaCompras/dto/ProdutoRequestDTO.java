package br.pucgo.ads.projetointegrador.listaCompras.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProdutoRequestDTO {

    @NotBlank(message = "O nome do Produto é obrigatório")
    @Size(max = 150)
    private String nome;

    @Size(max = 500)
    private String descricao;

    @NotBlank(message = "A unidade de medida é obrigatoria")
    @Size(max = 20)
    private String unidadeMedida;

    @NotNull(message = "O ID da categoria é obrigatório")
    private Long categoriaId;
}
