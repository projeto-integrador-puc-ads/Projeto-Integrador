package br.pucgo.ads.projetointegrador.plataforma.dto.midia;

import br.pucgo.ads.projetointegrador.plataforma.entity.Midia;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class MidiaResponseDTO {

    private UUID identificador;
    private String urlArquivo;
    private LocalDateTime dataUpload;

    /**
     * Construtor que converte uma entidade Midia em um MidiaResponseDTO.
     * @param midia A entidade a ser convertida.
     */
    public MidiaResponseDTO(Midia midia) {
        this.identificador = midia.getIdentificadorMidia();
        this.urlArquivo = midia.getUrlArquivo();
        this.dataUpload = midia.getDataUpload();
    }
}
