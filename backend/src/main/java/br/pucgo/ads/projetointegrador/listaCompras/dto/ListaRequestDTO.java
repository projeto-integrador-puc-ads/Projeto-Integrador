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

public class ListaRequestDTO {

    @NotBlank(message = "O título da lista é obrigatório")
    @Size(max = 200, message = "O título deve ter no máximo 200 caracteres")
    private String titulo;

    @NotNull(message = "O ID do usuário é obrigatório")
    private Long userId;

    private Boolean template = false;

    // Campos transient (apenas da API)
    @Size(max = 500, message = "A descrição deve ter no máximo 500 caracteres")
    private String descricao;
}
