package br.pucgo.ads.projetointegrador.listaCompras.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ListaCreateRequestDTO {

    @NotBlank(message = "O título da lista é obrigatório")
    @Size(max = 150, message = "O título da lista deve ter no máximo 150 caracteres")
    private String titulo;

    @NotNull(message = "A lista de itens é obrigatória")
    @Size(min = 1, message = "A lista deve possuir ao menos um item")
    private List<ListaItemCreateDTO> itens;
}
