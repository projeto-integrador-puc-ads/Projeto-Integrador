package br.pucgo.ads.projetointegrador.eldercare.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;

@Getter
@AllArgsConstructor
public class PlanoGeradoResponse {

    private String nome;
    private Integer idade;
    private String sexo;
    private Integer semanas;
    private Integer diasSemana;
    private Integer minDia;
    private Integer tempoSemanalMin;
    private String nivel;              // ALTO / MEDIO / BAIXO
    private List<DiaDTO> dias;

    @Getter
    @AllArgsConstructor
    public static class DiaDTO {
        // ESTE NOME TEM QUE SER "dia" PARA O FRONT ENXERGAR
        private String dia;                  // ex.: "SEGUNDA-FEIRA"
        private List<String> atividades;     // ex.: ["Caminhada ao ar livre"]
    }
}
