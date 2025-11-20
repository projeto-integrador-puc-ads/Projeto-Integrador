package br.pucgo.ads.projetointegrador.eldercare.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DiaPlanoResponse {
    private String dia;                // ex: "SEGUNDA-FEIRA"
    private List<String> atividades;   // ex: ["Caminhada ao ar livre", "Mobilidade..."]
}
