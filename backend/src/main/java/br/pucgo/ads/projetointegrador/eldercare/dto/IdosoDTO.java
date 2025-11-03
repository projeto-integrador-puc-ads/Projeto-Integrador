package br.pucgo.ads.projetointegrador.eldercare.dto;

import br.pucgo.ads.projetointegrador.eldercare.domain.Sexo;
import java.time.LocalDate;

public record IdosoDTO(Long id, String nome, LocalDate dataNascimento, Sexo sexo, String email, String telefone) {}
