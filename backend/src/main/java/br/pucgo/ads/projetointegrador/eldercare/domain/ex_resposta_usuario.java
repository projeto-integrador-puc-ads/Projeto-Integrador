package br.pucgo.ads.projetointegrador.eldercare.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Entity
@Table(name = "ex_resposta_usuario")
@Getter
@Setter
@NoArgsConstructor
public class ex_resposta_usuario {

    @Id
    @GeneratedValue
    @Column(columnDefinition = "uuid")
    private UUID id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "response_id")
    private ex_resposta_questionario respostaQuestionario;

    @ManyToOne(optional = false)
    @JoinColumn(name = "question_id")
    private ex_pergunta pergunta;

    @Column(name = "option_code")
    private String optionCode;

    @Column(name = "value_number")
    private Double valueNumber;

    @Column(name = "value_boolean")
    private Boolean valueBoolean;
}
