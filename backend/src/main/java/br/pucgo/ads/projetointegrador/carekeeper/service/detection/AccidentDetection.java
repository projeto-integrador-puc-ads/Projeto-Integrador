package com.example.carekeeper.service.detection;

import com.example.carekeeper.dto.SensorDTO;
import com.example.carekeeper.enums.AccidentType;
import com.example.carekeeper.interfaces.AccidentDetector;
import com.example.carekeeper.service.detection.detector.FallDetector;
import com.example.carekeeper.service.detection.detector.GeofenceDetector;
import com.example.carekeeper.service.detection.detector.ProlongedImmobilityDetector;
import com.example.carekeeper.pojo.UserConfig;
import com.example.carekeeper.config.detection.UserConfigService;
import com.example.carekeeper.util.EnvironmentUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@Slf4j
public class AccidentDetection {

    private final List<AccidentDetector> detectors = new ArrayList<>();
    private final UserConfigService userConfigService;

    public AccidentDetection(EnvironmentUtil envUtil, UserConfigService userConfigService) {
        this.userConfigService = userConfigService;

        UserConfig defaults = userConfigService.getDefaultConfig();
        detectors.add(new FallDetector(defaults.getFall(), envUtil));
        detectors.add(new GeofenceDetector(defaults.getGeofence(), envUtil));

        if (envUtil.isDev()) {
            log.debug("Detectores padrão carregados:");
            log.debug("FallDetector habilitado: {}", defaults.getFall().isEnabled());
            log.debug("GeofenceDetector habilitado: {}", defaults.getGeofence().isEnabled());
        }
    }

    public List<AccidentType> check(UUID userId, SensorDTO current, SensorDTO previous, EnvironmentUtil envUtil) {
        List<AccidentType> detectedAccidents = new ArrayList<>();

        UserConfig cfg = userConfigService.getConfigForUser(userId);

        if (envUtil.isDev()) {
            log.debug("Configurações do usuário userId={}", userId);
            if (cfg.getFall() != null) log.debug("FallDetector: enabled={}, thresholds={}", cfg.getFall().isEnabled(), cfg.getFall());
            if (cfg.getImmobility() != null) log.debug("ImmobilityDetector: enabled={}, config={}", cfg.getImmobility().isEnabled(), cfg.getImmobility());
            if (cfg.getGeofence() != null) log.debug("GeofenceDetector: enabled={}, config={}", cfg.getGeofence().isEnabled(), cfg.getGeofence());
        }

        List<AccidentDetector> userDetectors = new ArrayList<>();

        if (cfg.getFall() != null && cfg.getFall().isEnabled()) {
            userDetectors.add(new FallDetector(cfg.getFall(), envUtil));
        }

        if (cfg.getImmobility() != null && cfg.getImmobility().isEnabled()) {
            userDetectors.add(new ProlongedImmobilityDetector(cfg.getImmobility(), envUtil));
        }

        if (cfg.getGeofence() != null && cfg.getGeofence().isEnabled()) {
            userDetectors.add(new GeofenceDetector(cfg.getGeofence(), envUtil));
        }

        for (AccidentDetector detector : userDetectors) {
            if (detector.detect(current, previous)) {
                detectedAccidents.add(detector.getType());
                if (envUtil.isDev()) {
                    log.debug("Acidente detectado pelo detector {} para userId={}", detector.getType(), userId);
                }
            }
        }

        return detectedAccidents;
    }
}
