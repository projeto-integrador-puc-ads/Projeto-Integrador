package br.pucgo.ads.projetointegrador.remember.dto.Conquista;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.Data;
import org.hibernate.validator.constraints.URL;

@Data
public class ConquistaRequestDTO {

    @NotBlank(message = "O nome da conquista não pode estar em branco.")
    @Size(max = 255)
    private String nome;

    @NotBlank(message = "A descrição não pode estar em branco.")
    private String descricao;

    @NotBlank(message = "A URL do ícone não pode estar em branco.")
    @URL(message = "A URL do ícone deve ser válida.")
    @Size(max = 512)
    private String iconeUrl;

    @NotNull(message = "A pontuação é obrigatória.")
    @Positive(message = "A pontuação deve ser um número positivo.")
    private Integer pontos;
}
