package br.pucgo.ads.projetointegrador.listaCompras.dto;


import br.pucgo.ads.projetointegrador.listaCompras.entity.Patologia;
import br.pucgo.ads.projetointegrador.listaCompras.entity.Produto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProdutoSubstituivelResponseDTO {

    private Long produtoAlertadoId;
    private String produtoAlertadoNome;
    private PatologiaResponseDTO patologia;
    private ProdutoResponseDTO produtoSugestao;

}
