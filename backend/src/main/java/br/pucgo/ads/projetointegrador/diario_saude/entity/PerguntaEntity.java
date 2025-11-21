package br.pucgo.ads.projetointegrador.diario_saude.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "ds_pergunta")
public class PerguntaEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String texto;

    // Aqui armazenamos as opções como JSON ou String, com peso
    // Ex: [{"opcao":"Sim","peso":4},{"opcao":"Não","peso":0}]
    @Column(columnDefinition = "TEXT")
    private String opcoesJson;

    public PerguntaEntity() {}

    public PerguntaEntity(String texto, String opcoesJson) {
        this.texto = texto;
        this.opcoesJson = opcoesJson;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTexto() { return texto; }
    public void setTexto(String texto) { this.texto = texto; }

    public String getOpcoesJson() { return opcoesJson; }
    public void setOpcoesJson(String opcoesJson) { this.opcoesJson = opcoesJson; }
}
