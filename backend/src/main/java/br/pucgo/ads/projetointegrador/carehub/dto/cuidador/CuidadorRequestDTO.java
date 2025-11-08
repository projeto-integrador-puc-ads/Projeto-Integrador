package br.pucgo.ads.projetointegrador.carehub.dto.cuidador;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class CuidadorRequestDTO {
    private String nome;
    private String email;
    private String senha;
    private String telefone;
    private String experiencia;
    private List<String> especialidades;
    private String localizacao; // "Cidade-UF" ou apenas cidade
    private Boolean disponibilidade;
    private String biografia;
    private String fotoPerfil;
}
