package br.pucgo.ads.projetointegrador.diario_saude.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;

@Entity
@Table(name = "ds_usuario_doenca")
public class UsuarioDoencasEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_usuario_doenca;

    @ManyToOne
    @JoinColumn(name = "usuario_id", nullable = false)
    @JsonIgnore
    private UsuarioEntity usuario;

    @ManyToOne
    @JoinColumn(name = "doenca_id", nullable = false)
    private DoencasEntity doenca;

    public UsuarioDoencasEntity() {
    }

    public UsuarioDoencasEntity(UsuarioEntity usuario, DoencasEntity doenca) {
        this.usuario = usuario;
        this.doenca = doenca;
    }

    public Long getId_usuario_doenca() {
        return id_usuario_doenca;
    }

    public void setId_usuario_doenca(Long id_usuario_doenca) {
        this.id_usuario_doenca = id_usuario_doenca;
    }

    public UsuarioEntity getUsuario() {
        return usuario;
    }

    public void setUsuario(UsuarioEntity usuario) {
        this.usuario = usuario;
    }

    public DoencasEntity getDoenca() {
        return doenca;
    }

    public void setDoenca(DoencasEntity doenca) {
        this.doenca = doenca;
    }
}
