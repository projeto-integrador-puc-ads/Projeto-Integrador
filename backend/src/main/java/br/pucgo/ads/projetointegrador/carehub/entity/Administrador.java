package br.pucgo.ads.projetointegrador.carehub.entity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "ch_administrador")
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
public class Administrador extends Usuario {

    @Column(length = 128)
    private String departamento;

    @Column(name = "nivel_acesso", length = 64)
    private String nivelAcesso;

    @Column(name = "super_admin", nullable = false)
    private Boolean superAdmin = false;
}
