package br.pucgo.ads.projetointegrador.listaCompras.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Embeddable
@Data
@NoArgsConstructor
public class ItemListaId implements Serializable {

    @Column(name = "lista_id")
    private Long listaId;

    @Column(name = "produto_id")
    private Long produtoId;

    public ItemListaId(Long listaId, Long produtoId) {
        this.listaId = listaId;
        this.produtoId = produtoId;
    }
}
