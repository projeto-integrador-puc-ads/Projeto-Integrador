package br.pucgo.ads.projetointegrador.eldercare.dto;

import java.util.List;

public record GerarPlanoRequest(Long idosoId, List<RespostaDTO> respostas) {}
