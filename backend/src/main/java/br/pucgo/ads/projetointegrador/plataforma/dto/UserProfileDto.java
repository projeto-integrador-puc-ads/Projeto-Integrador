package br.pucgo.ads.projetointegrador.plataforma.dto;

import lombok.Data;

@Data
public class UserProfileDto {

    private String name;
    private String email;
    private String username;

    private Long roleId;

    private String crm;
    private String certificacao;
    private String experiencia;
}
