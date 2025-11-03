package br.pucgo.ads.projetointegrador.plataforma.dto;

import br.pucgo.ads.projetointegrador.plataforma.entity.Usuario;
import lombok.Data;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

@Data
public class UsuarioRequestDTO {
    
    @NotBlank(message = "Nome é obrigatório")
    @Size(max = 100, message = "Nome deve ter no máximo 100 caracteres")
    private String nome;
    
    @NotBlank(message = "Email é obrigatório")
    @Email(message = "Email deve ter formato válido")
    @Size(max = 150, message = "Email deve ter no máximo 150 caracteres")
    private String email;
    
    @NotBlank(message = "Telefone é obrigatório")
    @Size(max = 20, message = "Telefone deve ter no máximo 20 caracteres")
    private String telefone;
    
    @Size(max = 10, message = "Data de nascimento deve ter no máximo 10 caracteres")
    private String dataNascimento;
    
    @NotNull(message = "Tipo de usuário é obrigatório")
    private Usuario.TipoUsuario tipoUsuario;
    
    private Boolean ativo = true;
}