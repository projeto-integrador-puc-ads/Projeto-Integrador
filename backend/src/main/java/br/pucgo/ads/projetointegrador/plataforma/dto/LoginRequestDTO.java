package br.pucgo.ads.projetointegrador.plataforma.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record LoginRequestDTO(
        @NotBlank @Email String email
        // Se depois quiser usar senha, adicionamos aqui: String senha
) {}
