package br.pucgo.ads.projetointegrador.plataforma.dto;

import br.pucgo.ads.projetointegrador.plataforma.entity.RoleType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserProfileDto {
    private Long id;
    private String name;
    private String email;
    private RoleType role;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}