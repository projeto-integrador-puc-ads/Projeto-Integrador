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

public class CompraListaRequestDTO {

    @NotBlank(message = "O título da lista é obrigatório")
    @Size(max = 200)
    private String titulo;

    @Size(max = 500)
    private String descricao;

    @NotNull(message = "O ID do usuário é obrigatório")
    private Long usuarioId;
}
