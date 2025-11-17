package br.pucgo.ads.projetointegrador.listaCompras.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProdutoRequestDTO {

    @NotBlank(message = "O nome do produto é obrigatório")
    @Size(max = 150, message = "O nome deve ter no máximo 150 caracteres")
    private String nome;

    @Positive(message = "O preço deve ser maior que zero")
    private BigDecimal preco;

    @NotNull(message = "O ID da categoria é obrigatório")
    private Long categoriaId;

    @Size(max = 500, message = "As tags devem ter no máximo 500 caracteres")
    private String tags;

    private Boolean ativo = true;

    private Boolean isPersonalizado = false;

    // Campos transient (apenas para a API)
    private String descricao;

    private String unidadeMedida;
}
