package com.example.carekeeper.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Contém a leitura (mensagem ou identificação do alerta)
 * e as coordenadas geográficas do evento.
 */
@Data 
@NoArgsConstructor 
@AllArgsConstructor 
public class PanicAlertRequest {

    /** 
     * Texto ou código referente à leitura do alerta.
     * Exemplo: "Botão de pânico pressionado" ou "sensor_1".
     */
    private String leitura;

    /** Latitude do local onde o alerta foi gerado. */
    private double latitude;

    /** Longitude do local onde o alerta foi gerado. */
    private double longitude;
}
