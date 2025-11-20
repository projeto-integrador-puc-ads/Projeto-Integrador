package br.pucgo.ads.projetointegrador.eldercare.dto;

import br.pucgo.ads.projetointegrador.eldercare.domain.Sexo;
import jakarta.validation.constraints.*;

import java.time.LocalDate;

public record CriarIdosoDTO(

        @NotBlank
        @Size(max = 120)
        String nome,

        @NotNull
        @Past(message = "dataNascimento deve estar no passado")
        LocalDate dataNascimento,

        @NotNull
        Sexo sexo,

        @NotBlank
        @Email
        @Size(max = 255)
        String email,

        @NotBlank
        @Pattern(
            regexp = "^(?:\\+?55\\s?)?\\(?\\d{2}\\)?\\s?(?:9\\d{4}|\\d{4})-?\\d{4}$",
            message = "telefone deve estar no formato BR, ex.: (62) 99999-0000"
        )
        String telefone
) {}
