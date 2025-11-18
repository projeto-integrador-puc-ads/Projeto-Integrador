package br.pucgo.ads.projetointegrador.remember.entity;

import br.pucgo.ads.projetointegrador.plataforma.entity.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "resposta_pergunta_usuario")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RespostaPerguntaUsuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long identificadorRespostaPerguntaUsuario;

    @Column(name = "id_pergunta", nullable = false, unique = true)
    private Long identificadorPergunta;

    @Column(name = "id_usuario", nullable = false)
    private Long identificadorUsuario;

    @Column(name = "texto_resposta", nullable = false, columnDefinition = "TEXT")
    private String textoResposta;

    @Column(name = "data_resposta", nullable = false, updatable = false)
    private LocalDateTime dataResposta;

//    @OneToOne
//    @JoinColumn(name = "id_pergunta", insertable = false, updatable = false)
//    private PerguntaCognitiva perguntaCognitiva;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_usuario", insertable = false, updatable = false)
    private User usuario;

    @PrePersist
    protected void onCreate() {
        dataResposta = LocalDateTime.now();
    }
}
