package br.pucgo.ads.projetointegrador.remember.dto.conquista;

import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ConquistaRequestDTO {

    @NotBlank(message = "O nome da conquista não pode estar em branco.")
    @Size(max = 255)
    private String nome;

    @NotBlank(message = "A descrição não pode estar em branco.")
    private String descricao;

    @NotNull(message = "A meta é obrigatória.")
    @Positive(message = "A meta deve ser um número positivo.")
    private Integer meta;

    @NotNull(message = "A pontuação é obrigatória.")
    @Positive(message = "A pontuação deve ser um número positivo.")
    private Integer pontos;

    @NotNull(message = "O tipo da conquista é obrigatória.")
    @Positive(message = "O tipo da conquista deve ser um número positivo.")
    @Enumerated(EnumType.STRING)
    private Integer tipo;

    @NotBlank(message = "O ícone é obrigatório.")
    private String icone;
}
