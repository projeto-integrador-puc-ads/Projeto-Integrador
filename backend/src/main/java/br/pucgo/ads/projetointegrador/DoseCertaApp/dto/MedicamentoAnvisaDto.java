package br.pucgo.ads.projetointegrador.DoseCertaApp.dto;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MedicamentoAnvisaDto {
    private Long id;
    private String nomeProduto;
}