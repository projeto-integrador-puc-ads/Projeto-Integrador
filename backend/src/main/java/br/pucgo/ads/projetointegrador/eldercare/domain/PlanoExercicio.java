package br.pucgo.ads.projetointegrador.eldercare.domain;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "plano_exercicio")
public class PlanoExercicio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "idoso_id", nullable = false)
    private Idoso idoso;

    @Column(name = "data_criacao", nullable = false)
    private LocalDate dataCriacao;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private NivelTreino nivel;

    @Column(length = 1000)
    private String observacoes;

    @OneToMany(mappedBy = "plano", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ItemPlano> itens = new ArrayList<>();

    // Guarda o questionário respondido (lista de {pergunta,resposta}) em JSON
    // TEXT funciona bem no PostgreSQL; se for MySQL, pode usar LONGTEXT.
    @Column(name = "respostas_json", columnDefinition = "TEXT")
    private String respostasJson;

    // ==================== Getters/Setters ====================

    public Long getId() {
        return id;
    }

    public Idoso getIdoso() {
        return idoso;
    }

    public void setIdoso(Idoso idoso) {
        this.idoso = idoso;
    }

    public LocalDate getDataCriacao() {
        return dataCriacao;
    }

    public void setDataCriacao(LocalDate dataCriacao) {
        this.dataCriacao = dataCriacao;
    }

    public NivelTreino getNivel() {
        return nivel;
    }

    public void setNivel(NivelTreino nivel) {
        this.nivel = nivel;
    }

    public String getObservacoes() {
        return observacoes;
    }

    public void setObservacoes(String observacoes) {
        this.observacoes = observacoes;
    }

    public List<ItemPlano> getItens() {
        return itens;
    }

    public void setItens(List<ItemPlano> itens) {
        this.itens = itens;
    }

    public String getRespostasJson() {
        return respostasJson;
    }

    public void setRespostasJson(String respostasJson) {
        this.respostasJson = respostasJson;
    }
}
