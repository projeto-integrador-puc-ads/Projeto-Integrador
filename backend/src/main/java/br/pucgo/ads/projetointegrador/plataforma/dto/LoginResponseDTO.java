package br.pucgo.ads.projetointegrador.plataforma.dto;

public record LoginResponseDTO(
        String token,
        Long id,
        String nome,
        String email,
        String tipoUsuario
) {}
