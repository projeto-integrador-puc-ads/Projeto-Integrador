package br.pucgo.ads.projetointegrador.listaCompras.dto;


import br.pucgo.ads.projetointegrador.listaCompras.entity.Produto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PatologiaItemResponseDTO {

    private Long id;
    private PatologiaResponseDTO patologia;
    private ProdutoResponseDTO produto;
    private ProdutoResponseDTO produtoSugestao;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public PatologiaItemResponseDTO(Long id, PatologiaResponseDTO byId, ProdutoResponseDTO produto, Produto produtoSugestao, LocalDateTime createdAt, LocalDateTime updatedAt) {
    }
}
