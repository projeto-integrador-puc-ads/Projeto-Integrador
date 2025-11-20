package br.pucgo.ads.projetointegrador.eldercare.dto;

import br.pucgo.ads.projetointegrador.eldercare.domain.Sexo;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

import java.time.LocalDate;

/** Usado no SSO: se existir por e-mail, devolve; senão cria. */
public record EnsureIdosoRequest(
        @NotBlank String nome,
        @NotBlank @Email String email,
        LocalDate dataNascimento,
        Sexo sexo,
        String telefone
) {}
