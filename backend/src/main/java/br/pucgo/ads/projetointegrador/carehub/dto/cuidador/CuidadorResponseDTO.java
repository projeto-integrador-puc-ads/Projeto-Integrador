package br.pucgo.ads.projetointegrador.carehub.dto.cuidador;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CuidadorResponseDTO {
    private Long id;
    private String nome;
    private String email;
    private String telefone;
    private String experiencia;
    private List<String> especialidades;
    private String cidade;
    private String estado;
    private Boolean disponibilidade;
    private BigDecimal avaliacaoMedia;
    private BigDecimal taxaHora;
    private Integer totalAvaliacoes;
    private String biografia;
    private String fotoPerfil;
    private Boolean ativo;
    private LocalDateTime criadoEm;
}
