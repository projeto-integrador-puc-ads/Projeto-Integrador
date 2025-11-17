package br.pucgo.ads.projetointegrador.sabordafamilia.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

@Data 
@Entity
@Table(name = "sabordafamilia_restricoes_receita")
public class Restricoes {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_restricao")
    private Long id;

    @Column(name = "tem_gluten")
    private boolean temGluten;

    @Column(name = "tem_lactose")
    private boolean temLactose;

    @Column(name = "tem_acucar")
    private boolean temAcucar;

    // Este é o relacionamento 1-para-1 de volta para a Receita
    @JsonIgnore // <-- IMPORTANTE: Impede o loop infinito de JSON
    @OneToOne
    @JoinColumn(name = "id_receita") // Esta é a coluna da chave estrangeira
    private Receita receita;

}