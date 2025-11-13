package br.pucgo.ads.projetointegrador.remember.entity;

import br.pucgo.ads.projetointegrador.plataforma.entity.User;
import br.pucgo.ads.projetointegrador.remember.domain.StatusPergunta;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "pergunta_cognitiva")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PerguntaCognitiva {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long identificadorPerguntaCognitiva;

    @Column(name = "id_template_origem", nullable = false)
    private Long identificadorTemplateOrigem;

    @Column(name = "id_usuario", nullable = false)
    private Long identificadorUsuario;

    @Column(name = "id_lembranca_relacionada")
    private Long identificadorLembranca;

    @Column(name = "id_diario_relacionado")
    private Long identificadorDiario;

    @Column(name = "texto_pergunta", nullable = false, columnDefinition = "TEXT")
    private String textoPergunta;

    @Column(nullable = false)
    private Integer status;

    @Column(name = "data_geracao", nullable = false, updatable = false)
    private LocalDateTime dataGeracao;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_pergunta_template", insertable = false, updatable = false)
    private PerguntaTemplate PerguntaTemplate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_usuario", insertable = false, updatable = false)
    private User usuario;

//    @OneToOne(fetch = FetchType.LAZY, orphanRemoval = true)
//    private RespostaPerguntaUsuario resposta;

    @PrePersist
    protected void onCreate() {
        dataGeracao = LocalDateTime.now();
        if (status == null) {
            status = StatusPergunta.ENVIADA.getCodigo();
        }
    }
}
