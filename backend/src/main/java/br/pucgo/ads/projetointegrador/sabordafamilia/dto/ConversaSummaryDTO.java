package br.pucgo.ads.projetointegrador.sabordafamilia.dto;

import br.pucgo.ads.projetointegrador.sabordafamilia.entity.Usuario;
import java.time.LocalDateTime;

public class ConversaSummaryDTO {

    private UsuarioDTO contato;
    private String ultimaMensagem;
    private LocalDateTime dataUltimaMensagem;

    // Construtor
    public ConversaSummaryDTO(Usuario contato, String ultimaMensagem, LocalDateTime dataUltimaMensagem) {
        // Converte a entidade Usuario para UsuarioDTO
        UsuarioDTO contatoDTO = new UsuarioDTO();
        contatoDTO.setId(contato.getId());
        contatoDTO.setNome(contato.getNome());
        contatoDTO.setFotoPerfil(contato.getFotoPerfil());
        // ... (defina outros campos do UsuarioDTO se necessário)
        
        this.contato = contatoDTO;
        this.ultimaMensagem = ultimaMensagem;
        this.dataUltimaMensagem = dataUltimaMensagem;
    }

    // Getters e Setters
    public UsuarioDTO getContato() {
        return contato;
    }

    public void setContato(UsuarioDTO contato) {
        this.contato = contato;
    }

    public String getUltimaMensagem() {
        return ultimaMensagem;
    }

    public void setUltimaMensagem(String ultimaMensagem) {
        this.ultimaMensagem = ultimaMensagem;
    }

    public LocalDateTime getDataUltimaMensagem() {
        return dataUltimaMensagem;
    }

    public void setDataUltimaMensagem(LocalDateTime dataUltimaMensagem) {
        this.dataUltimaMensagem = dataUltimaMensagem;
    }
}