package br.pucgo.ads.projetointegrador.plataforma.dto;

import br.pucgo.ads.projetointegrador.plataforma.entity.Usuario;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class UsuarioResponseDTO {
    
    private Long id;
    private String nome;
    private String email;
    private String telefone;
    private String dataNascimento;
    private Usuario.TipoUsuario tipoUsuario;
    private Boolean ativo;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    public UsuarioResponseDTO(Usuario usuario) {
        this.id = usuario.getId();
        this.nome = usuario.getNome();
        this.email = usuario.getEmail();
        this.telefone = usuario.getTelefone();
        this.dataNascimento = usuario.getDataNascimento();
        this.tipoUsuario = usuario.getTipoUsuario();
        this.ativo = usuario.getAtivo();
        this.createdAt = usuario.getCreatedAt();
        this.updatedAt = usuario.getUpdatedAt();
    }
}