package br.pucgo.ads.projetointegrador.plataforma.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RoleDto {
    private Long id;
    private String code;
    private String name;
    private String scope;
}