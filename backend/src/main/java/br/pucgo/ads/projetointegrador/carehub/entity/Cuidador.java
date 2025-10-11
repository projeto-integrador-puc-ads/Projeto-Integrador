package br.pucgo.ads.projetointegrador.carehub.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "carehub_cuidadores")
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
public class Cuidador extends Usuario {

    @Column(columnDefinition = "TEXT")
    private String experiencia;

    @ElementCollection
    @CollectionTable(name = "carehub_cuidador_especialidades", joinColumns = @JoinColumn(name = "cuidador_id"))
    @Column(name = "especialidade")
    private List<String> especialidades = new ArrayList<>();

    @Column(length = 100)
    private String localizacao;

    @Enumerated(EnumType.STRING)
    private Disponibilidade disponibilidade;

    @Column(precision = 3, scale = 2)
    private BigDecimal avaliacaoMedia = BigDecimal.ZERO;

    @Column
    private Integer totalAvaliacoes = 0;

    @Column(columnDefinition = "TEXT")
    private String biografia;

    @Column(length = 255)
    private String fotoPerfil;

    public enum Disponibilidade {
        INTEGRAL,
        MEIO_PERIODO,
        NOTURNO,
        FINS_DE_SEMANA,
        EVENTUAL
    }
}
