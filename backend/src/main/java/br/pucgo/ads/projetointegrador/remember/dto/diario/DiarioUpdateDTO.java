package br.pucgo.ads.projetointegrador.remember.dto.diario;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDate;

@Data
public class DiarioUpdateDTO {

    @NotBlank(message = "O título não pode estar em branco.")
    @Size(max = 255, message = "O título não pode exceder 255 caracteres.")
    private String titulo;

    @NotBlank(message = "O conteúdo não pode estar em branco.")
    private String conteudo;
}
