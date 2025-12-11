package br.pucgo.ads.projetointegrador.remember.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "conquista")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Conquista {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long identificadorConquista;

    @Column(nullable = false)
    private String nome;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String descricao;

    @Column(nullable = false)
    private Integer meta;

    @Column(nullable = false)
    private Integer pontos;

    @Column(nullable = false)
    private Integer tipo;

    @ToString.Exclude
    @OneToMany(mappedBy = "conquista", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<UsuarioConquista> conquistasAtribuidas  = new ArrayList<>();
}
