package br.pucgo.ads.projetointegrador.plataforma.dto.diario;

import br.pucgo.ads.projetointegrador.plataforma.dto.midia.MidiaResponseDTO;
import br.pucgo.ads.projetointegrador.plataforma.entity.Diario;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Data
public class DiarioResponseDTO {

    private UUID identificador;
    private UUID identificadorUsuario;
    private String titulo;
    private String conteudo;
    private LocalDate dataEscrita;
    private LocalDateTime dataCriacao;
    private LocalDateTime dataAtualizacao;
    private List<MidiaResponseDTO> midias;

    /**
     * Construtor que converte uma entidade Diario em um DiarioResponseDTO.
     * @param diario A entidade a ser convertida.
     */
    public DiarioResponseDTO(Diario diario) {
        this.identificador = diario.getIdentificadorDiario();
        this.identificadorUsuario = diario.getIdentificadorUsuario();
        this.titulo = diario.getTitulo();
        this.conteudo = diario.getConteudo();
        this.dataEscrita = diario.getDataEscrita();
        this.dataCriacao = diario.getDataCriacao();
        this.dataAtualizacao = diario.getDataAtualizacao();

        if (diario.getMidias() != null) {
            this.midias = diario.getMidias().stream()
                    .map(MidiaResponseDTO::new)
                    .collect(Collectors.toList());
        }
    }
}
