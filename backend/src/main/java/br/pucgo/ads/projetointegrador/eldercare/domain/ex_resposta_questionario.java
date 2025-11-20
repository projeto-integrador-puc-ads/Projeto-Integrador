package br.pucgo.ads.projetointegrador.eldercare.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "ex_resposta_questionario")
@Getter
@Setter
@NoArgsConstructor
public class ex_resposta_questionario {

    @Id
    @GeneratedValue
    @Column(columnDefinition = "uuid")
    private UUID id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "participante_id")
    private ex_participante participante;

    @Column(name = "created_at")
    private OffsetDateTime createdAt = OffsetDateTime.now();
}
