package br.pucgo.ads.projetointegrador.plataforma.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.OffsetDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserResponseDto {
    private Long id;
    private String name;
    private String username;
    private String email;
    private RoleDto role;
    private String crm;
    private String certificacao;
    private String experiencia;
    private String phone;
    private LocalDate birthDate;
    private String photoUrl;
    private String status;
    private OffsetDateTime createdAt;
    private OffsetDateTime updatedAt;
}
