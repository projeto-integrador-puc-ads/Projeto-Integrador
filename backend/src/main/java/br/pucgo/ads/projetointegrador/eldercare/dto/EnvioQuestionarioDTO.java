package br.pucgo.ads.projetointegrador.eldercare.dto;

import jakarta.validation.constraints.NotNull;
import java.util.List;

public record EnvioQuestionarioDTO(@NotNull Long idosoId, @NotNull List<RespostaQuestionarioDTO> respostas) {}
