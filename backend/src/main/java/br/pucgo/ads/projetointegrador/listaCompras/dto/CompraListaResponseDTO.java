package br.pucgo.ads.projetointegrador.listaCompras.dto;
import br.pucgo.ads.projetointegrador.listaCompras.entity.CompraLista.StatusLista;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CompraListaResponseDTO {

    private Long id;
    private String titulo;
    private String descricao;
    private Long usuarioId;
    private String usuarioNome;
    private StatusLista status;
    private LocalDateTime dataFinalizacao;
    private LocalDateTime dataCriacao;
    private LocalDateTime dataAtualizacao;
    private List<ItemListaResponseDTO> itens;
}
