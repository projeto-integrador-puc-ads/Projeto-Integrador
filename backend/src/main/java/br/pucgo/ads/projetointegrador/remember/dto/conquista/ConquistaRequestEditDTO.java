package br.pucgo.ads.projetointegrador.remember.dto.conquista;

import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ConquistaRequestEditDTO {

    @NotBlank(message = "O nome da conquista não pode estar em branco.")
    @Size(max = 255)
    private String nome;

    @NotBlank(message = "A descrição não pode estar em branco.")
    private String descricao;
}
