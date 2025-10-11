package br.pucgo.ads.projetointegrador.carehub.dto.cuidador;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

import br.pucgo.ads.projetointegrador.carehub.entity.Cuidador;

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
    private String localizacao;
    private Cuidador.Disponibilidade disponibilidade;
    private String biografia;
    private String fotoPerfil;
}
