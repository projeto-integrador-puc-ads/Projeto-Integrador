package br.pucgo.ads.projetointegrador.plataforma.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PermissionRequestDto {

    private String name;
    private Long moduleId;
}
