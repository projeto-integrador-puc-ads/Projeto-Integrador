package br.pucgo.ads.projetointegrador.remember.entity;

import br.pucgo.ads.projetointegrador.plataforma.entity.Usuario;
import br.pucgo.ads.projetointegrador.remember.key.UsuarioConquistaKey;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "usuario_conquista")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UsuarioConquista {

    @EmbeddedId
    private UsuarioConquistaKey usuarioConquistaKey;

    @Column(name = "data_obtencao", nullable = false, updatable = false)
    private LocalDateTime dataObtencao;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("identificadorUsuario")
    @JoinColumn(name = "id_usuario")
    private Usuario usuario;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("identificadorConquista")
    @JoinColumn(name = "id_conquista")
    private Conquista conquista;


    @PrePersist
    protected void onCreate() {
        dataObtencao = LocalDateTime.now();
    }
}
