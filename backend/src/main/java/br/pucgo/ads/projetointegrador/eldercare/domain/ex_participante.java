package br.pucgo.ads.projetointegrador.eldercare.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "ex_participante")
@Getter
@Setter
@NoArgsConstructor
public class ex_participante{

    @Id
    @GeneratedValue
    @Column(columnDefinition = "uuid")
    private UUID id;

    @Column(name = "user_id")
    private UUID userId; // id do usuário na plataforma (pode ficar null por enquanto)

    @Column(nullable = false)
    private String nome;

    private LocalDate nascimento;

    private String sexo;

    @Column(name = "peso_kg")
    private Double pesoKg;

    @Column(name = "altura_cm")
    private Double alturaCm;

    private String observacoes;
}
