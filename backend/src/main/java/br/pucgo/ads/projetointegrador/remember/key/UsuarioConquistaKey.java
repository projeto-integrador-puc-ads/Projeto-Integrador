package br.pucgo.ads.projetointegrador.remember.key;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Embeddable
public class UsuarioConquistaKey implements Serializable {

    @Column(name = "id_usuario")
    private Long identificadorUsuario;

    @Column(name = "id_conquista")
    private Long identificadorConquista;
}
