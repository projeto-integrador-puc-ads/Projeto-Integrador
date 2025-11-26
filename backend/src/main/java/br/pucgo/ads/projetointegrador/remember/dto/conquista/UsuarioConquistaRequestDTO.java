package br.pucgo.ads.projetointegrador.remember.dto.conquista;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UsuarioConquistaRequestDTO {

    @NotNull(message = "O identificador do usuário é obrigatório.")
    private Long identificadorUsuario;

    @NotNull(message = "O identificador da conquista é obrigatório.")
    private Long identificadorConquista;
}
