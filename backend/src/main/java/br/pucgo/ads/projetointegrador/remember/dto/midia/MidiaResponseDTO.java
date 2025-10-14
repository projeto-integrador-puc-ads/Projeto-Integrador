package br.pucgo.ads.projetointegrador.remember.dto.midia;

import br.pucgo.ads.projetointegrador.remember.entity.Midia;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class MidiaResponseDTO {

    private Long identificadorMidia;
    private String urlArquivo;
    private LocalDateTime dataUpload;

    /**
     * Construtor que converte uma entidade Midia em um MidiaResponseDTO.
     * @param midia A entidade a ser convertida.
     */
    public MidiaResponseDTO(Midia midia) {
        this.identificadorMidia = midia.getIdentificadorMidia();
        this.urlArquivo = midia.getUrlArquivo();
        this.dataUpload = midia.getDataUpload();
    }
}
