package br.pucgo.ads.projetointegrador.plataforma.dto.diario;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import jakarta.validation.constraints.Size;
import lombok.Data;
import java.time.LocalDate;
import java.util.UUID;

@Data
public class DiarioRequestDTO {

    @NotNull(message = "O identificador do usuário é obrigatório.")
    private UUID identificadorUsuario;

    @NotBlank(message = "O título não pode estar em branco.")
    @Size(max = 255, message = "O título não pode exceder 255 caracteres.")
    private String titulo;

    @NotBlank(message = "O conteúdo não pode estar em branco.")
    private String conteudo;

    @NotNull(message = "A data da escrita é obrigatória.")
    @PastOrPresent(message = "A data da escrita не pode ser no futuro.")
    private LocalDate dataEscrita;
}
