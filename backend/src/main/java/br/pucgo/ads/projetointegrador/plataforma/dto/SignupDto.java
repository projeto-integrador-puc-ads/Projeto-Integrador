package br.pucgo.ads.projetointegrador.plataforma.dto;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SignupDto {

    private String name;
    private String username;
    private String email;
    private String password;
    private Long roleId;
    private LocalDate birthDate; // Novo campo
    private String phone; // Novo campo
    private String doc; // Novo campo

    // private String photoUrl; // Novo campo

    private String crm; // Para ROLE_MEDICO
    private String certificacao; // Para ROLE_CUIDADOR
    private String experiencia; // Para ROLE_CUIDADOR

}