package br.pucgo.ads.projetointegrador.eldercare.domain;

import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "ex_item_plano")
public class ex_item_plano {

    @Id
    @Column(name = "id", columnDefinition = "uuid")
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "day_id", nullable = false)
    private ex_dia_plano dia;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "exercicio_id", nullable = false)
    private ex_exercicio exercicio;

    @Column(name = "series")
    private Integer series;

    @Column(name = "repeticoes")
    private Integer repeticoes;

    @Column(name = "duracao_seg")
    private Integer duracaoSeg;

    @Column(name = "ordem")
    private Integer ordem;

    @PrePersist
    public void prePersist() {
        if (id == null) id = UUID.randomUUID();
    }

    // === getters/setters ===
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public ex_dia_plano getDia() { return dia; }
    public void setDia(ex_dia_plano dia) { this.dia = dia; }

    public ex_exercicio getExercicio() { return exercicio; }
    public void setExercicio(ex_exercicio exercicio) { this.exercicio = exercicio; }

    public Integer getSeries() { return series; }
    public void setSeries(Integer series) { this.series = series; }

    public Integer getRepeticoes() { return repeticoes; }
    public void setRepeticoes(Integer repeticoes) { this.repeticoes = repeticoes; }

    public Integer getDuracaoSeg() { return duracaoSeg; }
    public void setDuracaoSeg(Integer duracaoSeg) { this.duracaoSeg = duracaoSeg; }

    public Integer getOrdem() { return ordem; }
    public void setOrdem(Integer ordem) { this.ordem = ordem; }
}
