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

    private Long produtoAlertadoId;       // Produto que gerou o alerta
    private String produtoAlertadoNome;
    private PatologiaResponseDTO patologia; // Patologia que causou o alerta
    private ProdutoResponseDTO produtoSugestao; // Produto substituto sugerido

    public ProdutoSubstituivelResponseDTO(Produto produtoSugestao, Patologia patologia, Long id) {
    }
}
