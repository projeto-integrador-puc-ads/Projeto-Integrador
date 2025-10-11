package br.pucgo.ads.projetointegrador.carehub.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "carehub_clientes")
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
public class Cliente extends Usuario {

    @Column(columnDefinition = "TEXT")
    private String necessidades;

    @Column(length = 100)
    private String endereco;

    @Column(length = 20)
    private String telefoneEmergencia;

    @Column(length = 100)
    private String contatoEmergencia;

    @Enumerated(EnumType.STRING)
    private TipoCliente tipoCliente;

    public enum TipoCliente {
        IDOSO,
        FAMILIAR
    }
}
