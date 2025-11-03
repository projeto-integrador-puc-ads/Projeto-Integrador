package br.pucgo.ads.projetointegrador.eldercare.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;           // <- ADICIONE ESTE IMPORT
import jakarta.persistence.*;
import java.time.DayOfWeek;

@Entity
@Table(name = "item_plano")
public class ItemPlano {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "plano_id", nullable = false)
    @JsonIgnore                                           // <- EVITA RECURSÃO NA RESPOSTA JSON
    private PlanoExercicio plano;

    @Enumerated(EnumType.STRING)
    @Column(name = "dia_semana", nullable = false, length = 10)
    private DayOfWeek diaSemana;

    @Column(nullable = false, length = 120)
    private String atividade;

    @Column(name = "duracao_min", nullable = false)
    private Integer duracaoMin;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private Intensidade intensidade;

    @Column(length = 500)
    private String observacoes;

    // Getters e Setters
    public Long getId() { return id; }

    public PlanoExercicio getPlano() { return plano; }
    public void setPlano(PlanoExercicio plano) { this.plano = plano; }

    public DayOfWeek getDiaSemana() { return diaSemana; }
    public void setDiaSemana(DayOfWeek diaSemana) { this.diaSemana = diaSemana; }

    public String getAtividade() { return atividade; }
    public void setAtividade(String atividade) { this.atividade = atividade; }

    public Integer getDuracaoMin() { return duracaoMin; }
    public void setDuracaoMin(Integer duracaoMin) { this.duracaoMin = duracaoMin; }

    public Intensidade getIntensidade() { return intensidade; }
    public void setIntensidade(Intensidade intensidade) { this.intensidade = intensidade; }

    public String getObservacoes() { return observacoes; }
    public void setObservacoes(String observacoes) { this.observacoes = observacoes; }
}
