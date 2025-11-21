package br.pucgo.ads.projetointegrador.diario_saude.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(name = "ds_usuario_alergia")
public class UsuarioAlergiaEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_usuario_alergia;

    @ManyToOne
    @JoinColumn(name = "usuario_id", nullable = false)
    @JsonIgnore
    private UsuarioEntity usuario;

    @ManyToOne
    @JoinColumn(name = "alergia_id", nullable = false)
    private AlergiaEntity alergia;

    public UsuarioAlergiaEntity() {}

    public UsuarioAlergiaEntity(UsuarioEntity usuario, AlergiaEntity alergia) {
        this.usuario = usuario;
        this.alergia = alergia;
    }

    public Long getId_usuario_alergia() { return id_usuario_alergia; }
    public UsuarioEntity getUsuario() { return usuario; }
    public AlergiaEntity getAlergia() { return alergia; }

    public void setUsuario(UsuarioEntity usuario) { this.usuario = usuario; }
    public void setAlergia(AlergiaEntity alergia) { this.alergia = alergia; }
}
