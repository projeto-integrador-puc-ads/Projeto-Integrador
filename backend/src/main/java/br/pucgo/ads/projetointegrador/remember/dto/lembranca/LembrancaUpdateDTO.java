package br.pucgo.ads.projetointegrador.remember.dto.lembranca;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDate;

@Data
public class LembrancaUpdateDTO {

    @NotBlank(message = "O título não pode estar em branco.")
    @Size(max = 255, message = "O título não pode exceder 255 caracteres.")
    private String titulo;

    @NotNull(message = "A data do acontecimento é obrigatória.")
    @PastOrPresent(message = "A data do acontecimento não pode ser no futuro.")
    private LocalDate dataAcontecimento;

    private String pessoasPresentes;

    @Size(max = 255, message = "O local não pode exceder 255 caracteres.")
    private String local;

    @NotBlank(message = "A história não pode estar em branco.")
    private String historia;

    private String imagem;
}
