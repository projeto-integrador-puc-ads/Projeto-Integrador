package br.pucgo.ads.projetointegrador.listaCompras.dto;


import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PatologiaItemRequestDTO {

    @NotNull(message = "O ID da patologia é obrigatório")
    private Long patologiaId;

    @NotNull(message = "O ID do produto é obrigatório")
    private Long produtoId;

    private Long produtoSugestaoId; // Opcional - produto que pode substituir
}
