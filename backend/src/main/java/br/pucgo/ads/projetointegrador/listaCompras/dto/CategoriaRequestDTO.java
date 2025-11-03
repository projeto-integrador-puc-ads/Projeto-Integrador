package br.pucgo.ads.projetointegrador.listaCompras.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CategoriaRequestDTO {

    @NotBlank(message = "O nome da categoria é obrigatório")
    @Size(max = 100)
    private String nome;

    @Size(max = 255)
    private String descricao;
}
