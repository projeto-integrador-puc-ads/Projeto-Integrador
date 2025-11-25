package br.pucgo.ads.projetointegrador.plataforma.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.OffsetDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PermissionResponseDto {

    private Long id;
    private String name;
    private Long moduleId;
    private String moduleName;
    private OffsetDateTime createdAt;
}
