package br.pucgo.ads.projetointegrador.remember.dto.lembranca;

import br.pucgo.ads.projetointegrador.remember.dto.midia.MidiaResponseDTO;
import br.pucgo.ads.projetointegrador.remember.entity.Lembranca;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Data
public class LembrancaResponseDTO {

    private Long identificadorLembranca;
    private Long identificadorUsuario;
    private String titulo;
    private LocalDate dataAcontecimento;
    private String pessoasPresentes;
    private String local;
    private String historia;
    private LocalDateTime dataCriacao;
    private LocalDateTime dataAtualizacao;
    private List<MidiaResponseDTO> midias;

    /**
     * Construtor que converte uma entidade Lembranca em um LembrancaResponseDTO.
     * @param lembranca A entidade a ser convertida.
     */
    public LembrancaResponseDTO(Lembranca lembranca) {
        this.identificadorLembranca = lembranca.getIdentificadorLembranca();
        this.identificadorUsuario = lembranca.getIdentificadorUsuario();
        this.titulo = lembranca.getTitulo();
        this.dataAcontecimento = lembranca.getDataAcontecimento();
        this.pessoasPresentes = lembranca.getPessoasPresentes();
        this.local = lembranca.getLocal();
        this.historia = lembranca.getHistoria();
        this.dataCriacao = lembranca.getDataCriacao();
        this.dataAtualizacao = lembranca.getDataAtualizacao();

        if (lembranca.getMidias() != null) {
            this.midias = lembranca.getMidias().stream()
                    .map(MidiaResponseDTO::new)
                    .collect(Collectors.toList());
        }
    }
}
