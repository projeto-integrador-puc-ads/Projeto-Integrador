package br.pucgo.ads.projetointegrador.diario_saude.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "ds_resposta_questionario")
public class RespostaQuestionarioEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "usuario_id", nullable = false)
    private UsuarioEntity usuario;

    @ManyToOne
    @JoinColumn(name = "pergunta_id", nullable = false)
    private PerguntaEntity pergunta;

    @Column(nullable = false)
    private String resposta;

    @Column(nullable = false)
    private int peso;

    public RespostaQuestionarioEntity() {}

    public RespostaQuestionarioEntity(UsuarioEntity usuario, PerguntaEntity pergunta, String resposta, int peso) {
        this.usuario = usuario;
        this.pergunta = pergunta;
        this.resposta = resposta;
        this.peso = peso;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public UsuarioEntity getUsuario() { return usuario; }
    public void setUsuario(UsuarioEntity usuario) { this.usuario = usuario; }

    public PerguntaEntity getPergunta() { return pergunta; }
    public void setPergunta(PerguntaEntity pergunta) { this.pergunta = pergunta; }

    public String getResposta() { return resposta; }
    public void setResposta(String resposta) { this.resposta = resposta; }

    public int getPeso() { return peso; }
    public void setPeso(int peso) { this.peso = peso; }
}
