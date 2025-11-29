package br.pucgo.ads.projetointegrador.carekeeper.service.detection;

import br.pucgo.ads.projetointegrador.carekeeper.config.detection.UserConfig;
import br.pucgo.ads.projetointegrador.carekeeper.dto.SensorDTO;
import br.pucgo.ads.projetointegrador.carekeeper.enums.AccidentType;
import br.pucgo.ads.projetointegrador.carekeeper.interfaces.AccidentDetector;
import br.pucgo.ads.projetointegrador.carekeeper.service.detection.config.UserConfigurationCache;
import br.pucgo.ads.projetointegrador.carekeeper.service.detection.detector.FallDetector;
import br.pucgo.ads.projetointegrador.carekeeper.service.detection.detector.GeofenceDetector;
import br.pucgo.ads.projetointegrador.carekeeper.service.detection.detector.ProlongedImmobilityDetector;
import br.pucgo.ads.projetointegrador.carekeeper.utils.EnvironmentUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@Slf4j
public class AccidentDetection {

    private final List<AccidentDetector> detectors = new ArrayList<>();
    private final UserConfigurationCache userConfigurationCache;

    public AccidentDetection(EnvironmentUtil envUtil, UserConfigurationCache userConfigurationCache) {
        this.userConfigurationCache = userConfigurationCache;

        UserConfig defaults = userConfigurationCache.getDefaultConfig();
        detectors.add(new FallDetector(defaults.getFall(), envUtil));
        detectors.add(new GeofenceDetector(defaults.getGeofence(), envUtil));

        if (envUtil.isDev()) {
            log.debug("Detectores padrão carregados:");
            log.debug("FallDetector habilitado: {}", defaults.getFall().isEnabled());
            log.debug("GeofenceDetector habilitado: {}", defaults.getGeofence().isEnabled());
        }
    }

    public List<AccidentType> check(Long userId, SensorDTO current, SensorDTO previous, EnvironmentUtil envUtil) {
        List<AccidentType> detectedAccidents = new ArrayList<>();

        UserConfig cfg = userConfigurationCache.getConfigForUser(userId);

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
