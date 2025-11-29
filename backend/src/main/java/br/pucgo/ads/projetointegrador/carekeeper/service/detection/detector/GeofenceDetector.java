package com.example.carekeeper.service.detection.detector;

import com.example.carekeeper.interfaces.AccidentDetector;
import com.example.carekeeper.enums.AccidentType;
import com.example.carekeeper.dto.SensorDTO;
import com.example.carekeeper.util.EnvironmentUtil;
import com.example.carekeeper.pojo.UserConfig;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class GeofenceDetector implements AccidentDetector {

    private static final Logger log = LoggerFactory.getLogger(GeofenceDetector.class);
    private static final double EARTH_RADIUS_METERS = 6371000;

    private final double centerLat;
    private final double centerLon;
    private final double radiusMeters;
    private final boolean enabled;
    private final EnvironmentUtil envUtil;

    public GeofenceDetector(UserConfig.Geofence config, EnvironmentUtil envUtil) {
        this.centerLat = (config != null) ? config.getCenterLat() : 0.0;
        this.centerLon = (config != null) ? config.getCenterLon() : 0.0;
        this.radiusMeters = (config != null) ? config.getRadiusMeters() : 100.0;
        this.enabled = config.isEnabled();
        this.envUtil = envUtil;
        if (envUtil.isDev()) {
            log.debug("GeofenceDetector config: enabled={} | centerLat={} | centerLon={} | radiusMeters={}",
                    this.enabled,
                    this.centerLat,
                    this.centerLon,
                    this.radiusMeters);
        }
    }

    @Override
    public boolean detect(SensorDTO current, SensorDTO previous) {
        if (!enabled) return false;
        double distance = calcularDistanciaEmMetros(centerLat, centerLon, current.getLatitude(), current.getLongitude());

        if (envUtil.isDev()) {
            log.debug("📍 Geofence check: LatAtual={} | LonAtual={} | Distância={} m | RaioPermitido={} m",
                    current.getLatitude(), current.getLongitude(), String.format("%.2f", distance), radiusMeters);
        }

        if (distance > radiusMeters) {
            if (envUtil.isDev()) log.warn("⚠️ Usuário fora da zona segura! Distância: {} m > Raio: {} m",
                    String.format("%.2f", distance), radiusMeters);
            return true;
        } else {
            if (envUtil.isDev()) log.debug("✅ Usuário dentro da zona segura.");
            return false;
        }
    }

    @Override
    public AccidentType getType() {
        return AccidentType.OUT_OF_SAFE_ZONE;
    }

    private double calcularDistanciaEmMetros(double lat1, double lon1, double lat2, double lon2) {
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return EARTH_RADIUS_METERS * c;
    }
}
