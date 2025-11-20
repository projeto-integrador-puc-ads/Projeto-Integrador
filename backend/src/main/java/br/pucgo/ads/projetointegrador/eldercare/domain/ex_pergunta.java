package br.pucgo.ads.projetointegrador.eldercare.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Entity
@Table(name = "ex_pergunta")
@Getter
@Setter
@NoArgsConstructor
public class ex_pergunta {

    @Id
    @GeneratedValue
    @Column(columnDefinition = "uuid")
    private UUID id;

    private Integer ordem;

    @Column(nullable = false)
    private String enunciado;

    private String tipo; // ex: "texto", "opcao", "numero"
}
