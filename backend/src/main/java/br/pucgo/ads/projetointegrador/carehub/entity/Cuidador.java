package br.pucgo.ads.projetointegrador.carehub.entity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "ch_cuidador")
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
public class Cuidador extends Usuario {

    @Column(columnDefinition = "TEXT")
    private String experiencia;

    @ManyToMany
    @JoinTable(
        name = "ch_cuidador_especialidade",
        joinColumns = @JoinColumn(name = "cuidador_id"),
        inverseJoinColumns = @JoinColumn(name = "especialidade_id")
    )
    private Set<Especialidade> especialidades = new HashSet<>();

    // Cidade e UF
    @Column(length = 128)
    private String cidade;

    @Column(length = 2)
    private String estado;

    // Disponibilidade simples (true/false)
    @Column(nullable = false)
    private Boolean disponibilidade = true;

    // Taxa hora e média de avaliação
    @Column(name = "taxa_hora", precision = 10, scale = 2)
    private BigDecimal taxaHora;

    @Column(name = "avaliacao_media", precision = 3, scale = 2)
    private BigDecimal avaliacaoMedia = BigDecimal.ZERO;

    @Column
    private Integer totalAvaliacoes = 0;

    @Column(columnDefinition = "TEXT")
    private String biografia;

    @Column(length = 255)
    private String fotoPerfil;
}
