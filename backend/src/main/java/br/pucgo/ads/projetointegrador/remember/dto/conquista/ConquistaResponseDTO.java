package br.pucgo.ads.projetointegrador.remember.dto.conquista;

import br.pucgo.ads.projetointegrador.remember.domain.TipoConquista;
import br.pucgo.ads.projetointegrador.remember.entity.Conquista;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ConquistaResponseDTO {

    private Long identificadorConquista;
    private String nome;
    private String descricao;
    private Integer meta;
    private Integer pontos;
    private String tipo;
    private String icone;

    /**
     * Construtor que converte uma entidade Conquista em um ConquistaResponseDTO.
     * @param conquista A entidade a ser convertida.
     */
    public ConquistaResponseDTO(Conquista conquista) {
        this.identificadorConquista = conquista.getIdentificadorConquista();
        this.nome = conquista.getNome();
        this.descricao = conquista.getDescricao();
        this.meta = conquista.getMeta();
        this.pontos = conquista.getPontos();
        this.tipo = TipoConquista.of(conquista.getTipo()).formatarCodigoDescricao();
    }
}