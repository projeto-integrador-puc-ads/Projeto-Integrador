package br.pucgo.ads.projetointegrador.remember.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "pergunta_template")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PerguntaTemplate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long identificadorPerguntaTemplate;

    @Column(name = "texto_template", nullable = false, columnDefinition = "TEXT")
    private String textoTemplate;

    @Column(name = "gatilho_tipo", nullable = false)
    private Integer gatilhoTipo;

    @Column(name = "gatilho_valores", columnDefinition = "TEXT")
    private String gatilhoValores;

    @Column(name = "campo_alvo", length = 50)
    private String campoAlvo;

    @Column(name = "campo_placeholder", length = 50)
    private String campoPlaceholder;

    @Column(nullable = false)
    private boolean ativo = true;
}
