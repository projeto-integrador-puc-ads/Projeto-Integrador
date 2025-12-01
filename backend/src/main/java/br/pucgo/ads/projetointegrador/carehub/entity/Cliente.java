package br.pucgo.ads.projetointegrador.carehub.entity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "ch_cliente")
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
public class Cliente extends Usuario {

    @Column(columnDefinition = "TEXT")
    private String necessidades;

    @Column(length = 255)
    private String endereco;

    @Column(name = "contato_emergencia", length = 255)
    private String contatoEmergencia;

    @Column(name = "tipo_cliente", length = 64)
    private String tipoCliente;
}
