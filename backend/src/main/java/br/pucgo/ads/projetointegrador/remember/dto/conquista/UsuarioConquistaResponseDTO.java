package br.pucgo.ads.projetointegrador.remember.dto.conquista;

import br.pucgo.ads.projetointegrador.remember.entity.UsuarioConquista;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UsuarioConquistaResponseDTO {

    private Long identificadorUsuario;
    private LocalDateTime dataObtencao;
    private ConquistaResponseDTO conquista;

    /**
     * Construtor que converte uma entidade de ligação UsuarioConquista em um DTO.
     * @param usuarioConquista A entidade a ser convertida.
     */
    public UsuarioConquistaResponseDTO(UsuarioConquista usuarioConquista) {
        this.identificadorUsuario = usuarioConquista.getUsuarioConquistaKey().getIdentificadorUsuario();
        this.dataObtencao = usuarioConquista.getDataObtencao();
        this.conquista = new ConquistaResponseDTO(usuarioConquista.getConquista());
    }
}
