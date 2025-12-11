package br.pucgo.ads.projetointegrador.remember.dto.diario;

import br.pucgo.ads.projetointegrador.remember.dto.conquista.ConquistaResponseDTO;
import br.pucgo.ads.projetointegrador.remember.dto.midia.MidiaResponseDTO;
import br.pucgo.ads.projetointegrador.remember.entity.Diario;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Data
public class DiarioResponseDTO {

    private Long identificadorDiario;
    private Long identificadorUsuario;
    private String titulo;
    private String conteudo;
    private LocalDate dataEscrita;
    private LocalDateTime dataCriacao;
    private LocalDateTime dataAtualizacao;
    private List<ConquistaResponseDTO> conquistasDesbloqueadas = new ArrayList<>();

    /**
     * Construtor que converte uma entidade Diario em um DiarioResponseDTO.
     * @param diario A entidade a ser convertida.
     */
    public DiarioResponseDTO(Diario diario) {
        this.identificadorDiario = diario.getIdentificadorDiario();
        this.identificadorUsuario = diario.getIdentificadorUsuario();
        this.titulo = diario.getTitulo();
        this.conteudo = diario.getConteudo();
        this.dataEscrita = diario.getDataEscrita();
        this.dataCriacao = diario.getDataCriacao();
        this.dataAtualizacao = diario.getDataAtualizacao();
    }
}
