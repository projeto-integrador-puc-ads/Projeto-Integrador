package br.pucgo.ads.projetointegrador.remember.dto.Conquista;

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
    private String iconeUrl;
    private Integer pontos;

    /**
     * Construtor que converte uma entidade Conquista em um ConquistaResponseDTO.
     * @param conquista A entidade a ser convertida.
     */
    public ConquistaResponseDTO(Conquista conquista) {
        this.identificadorConquista = conquista.getIdentificadorConquista();
        this.nome = conquista.getNome();
        this.descricao = conquista.getDescricao();
        this.iconeUrl = conquista.getIconeUrl();
        this.pontos = conquista.getPontos();
    }
}