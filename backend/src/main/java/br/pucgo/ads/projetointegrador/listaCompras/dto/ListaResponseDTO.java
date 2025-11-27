package br.pucgo.ads.projetointegrador.listaCompras.dto;
import br.pucgo.ads.projetointegrador.listaCompras.entity.Lista.StatusLista;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ListaResponseDTO {

    private Long id;
    private String titulo;
    private Long userId;
    private String userNome;
    private Long patologiaId;
    private Boolean template;
    private LocalDateTime createdAt;

    // Campos transient (apenas da API)
    private String descricao;
    private String status; // "ABERTA" ou "FINALIZADA"
    private List<ItemListaResponseDTO> itens;
}
