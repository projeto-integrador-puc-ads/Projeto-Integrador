package br.pucgo.ads.projetointegrador.carekeeper.service.detection;

import br.pucgo.ads.projetointegrador.carekeeper.config.detection.UserConfig;
import br.pucgo.ads.projetointegrador.carekeeper.dto.SensorDTO;
import br.pucgo.ads.projetointegrador.carekeeper.enums.AccidentType;
import br.pucgo.ads.projetointegrador.carekeeper.interfaces.AccidentDetector;
import br.pucgo.ads.projetointegrador.carekeeper.service.detection.config.UserConfigurationCache;
import br.pucgo.ads.projetointegrador.carekeeper.service.detection.detector.FallDetector;
import br.pucgo.ads.projetointegrador.carekeeper.service.detection.detector.GeofenceRadarCircularDetector;
import br.pucgo.ads.projetointegrador.carekeeper.service.detection.detector.ProlongedImmobilityDetector;
import br.pucgo.ads.projetointegrador.carekeeper.utils.EnvironmentUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@Slf4j
public class AccidentDetection {

    private final UserConfigurationCache userConfigurationCache;
    private final EnvironmentUtil envUtil;

    // Mantém detectores persistentes por usuário
    private final Map<Long, List<AccidentDetector>> userDetectorsMap = new HashMap<>();

    public AccidentDetection(EnvironmentUtil envUtil, UserConfigurationCache userConfigurationCache) {
        this.userConfigurationCache = userConfigurationCache;
        this.envUtil = envUtil;
    }

    /**
     * Verifica acidentes para um usuário com base na leitura atual.
     */
    public List<AccidentType> check(Long userId, SensorDTO current, SensorDTO previous) {
        // Cria detectores do usuário apenas uma vez
        List<AccidentDetector> userDetectors = userDetectorsMap.computeIfAbsent(userId, id -> {
            UserConfig cfg = userConfigurationCache.getConfigForUser(id);
            List<AccidentDetector> detectors = new ArrayList<>();

            if (cfg.getFall() != null && cfg.getFall().isEnabled()) {
                detectors.add(new FallDetector(cfg.getFall(), envUtil));
            }
            if (cfg.getImmobility() != null && cfg.getImmobility().isEnabled()) {
                detectors.add(new ProlongedImmobilityDetector(cfg.getImmobility()));
            }
            if (cfg.getGeofence() != null && cfg.getGeofence().isEnabled()) {
                detectors.add(new GeofenceRadarCircularDetector(cfg.getGeofence()));
            }

            log.debug("Detectores do usuário {} inicializados: {}", userId, detectors);
            return detectors;
        });

        List<AccidentType> detectedAccidents = new ArrayList<>();
        for (AccidentDetector detector : userDetectors) {
            if (detector.detect(current, previous)) {
                detectedAccidents.add(detector.getType());
            }
        }

        return detectedAccidents;
    }
}
