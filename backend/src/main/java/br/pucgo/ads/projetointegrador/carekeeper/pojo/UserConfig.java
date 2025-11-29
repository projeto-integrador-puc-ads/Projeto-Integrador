package com.example.carekeeper.pojo;

import com.example.carekeeper.enums.Sensitivity;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Representa as configurações do usuário relacionadas aos detectores de segurança.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserConfig {

    /**
     * Configurações da cerca geográfica (geofence).
     */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Geofence {
        private boolean enabled = false;  
        private double centerLat;        // Latitude do centro
        private double centerLon;        // Longitude do centro
        private double radiusMeters;     // Raio em metros
    }

    /**
     * Configurações do detector de queda.
     */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Fall {
        private boolean enabled = true;                
        private Sensitivity sensitivity = Sensitivity.MEDIUM; // Nível de sensibilidade
    }

    /**
     * Configurações do detector de imobilidade prolongada.
     */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Immobility {
        private boolean enabled = true;  
        private long timeLimitMs = 86400L; // Tempo limite em milissegundos
    }

    // Instâncias padrão das configurações
    private Geofence geofence = new Geofence();
    private Fall fall = new Fall();
    private Immobility immobility = new Immobility();
}
