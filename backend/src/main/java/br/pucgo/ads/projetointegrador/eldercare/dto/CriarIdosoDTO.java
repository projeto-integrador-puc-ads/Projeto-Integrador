package br.pucgo.ads.projetointegrador.eldercare.dto;

import br.pucgo.ads.projetointegrador.eldercare.domain.Sexo;
import jakarta.validation.constraints.*;
import java.time.LocalDate;

public record CriarIdosoDTO(
        @NotBlank String nome,
        @NotNull LocalDate dataNascimento,
        @NotNull Sexo sexo,
        @Email @NotBlank String email,
        @NotBlank String telefone
) {}
