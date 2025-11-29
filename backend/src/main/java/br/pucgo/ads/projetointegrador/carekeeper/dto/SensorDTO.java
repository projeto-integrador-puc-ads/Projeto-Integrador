package com.example.carekeeper.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para dados de sensores do celular.
 * Contém acelerômetro, giroscópio, GPS e timestamp.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SensorDTO {
    // Movimento
    private Double accelerometerX;
    private Double accelerometerY;
    private Double accelerometerZ;
    private Double gyroscopeX;
    private Double gyroscopeY;
    private Double gyroscopeZ;
    // Localização
    private Double latitude;
    private Double longitude;
    // Tempo
    private Long timestamp;
}