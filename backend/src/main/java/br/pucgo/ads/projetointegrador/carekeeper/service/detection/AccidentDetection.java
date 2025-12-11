package br.pucgo.ads.projetointegrador.carekeeper.service.detection;

import br.pucgo.ads.projetointegrador.carekeeper.config.detection.UserConfig;
import br.pucgo.ads.projetointegrador.carekeeper.dto.SensorDTO;
import br.pucgo.ads.projetointegrador.carekeeper.enums.AccidentType;
import br.pucgo.ads.projetointegrador.carekeeper.interfaces.AccidentDetector;
import br.pucgo.ads.projetointegrador.carekeeper.service.detection.config.UserConfigurationCache;
import br.pucgo.ads.projetointegrador.carekeeper.service.detection.detector.FallDetector;
import br.pucgo.ads.projetointegrador.carekeeper.service.detection.detector.GeofenceRadarCircularDetector;
import br.pucgo.ads.projetointegrador.carekeeper.service.detection.detector.ProlongedImmobilityDetector;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Service
@Slf4j
public class AccidentDetection {

    private final UserConfigurationCache userConfigurationCache;

    // Mantém detectores por usuário (atualizados conforme configuração)
    private final Map<Long, List<AccidentDetector>> userDetectorsMap = new ConcurrentHashMap<>();

    // Guarda a versão/hash da configuração atual para saber se precisa recriar
    private final Map<Long, Integer> userConfigHashMap = new ConcurrentHashMap<>();

    public AccidentDetection(UserConfigurationCache userConfigurationCache) {
        this.userConfigurationCache = userConfigurationCache;
    }

    /**
     * Verifica acidentes para um usuário com base na leitura atual.
     * Recria detectores automaticamente se a configuração foi atualizada.
     */
    public List<AccidentType> check(Long userId, SensorDTO current, SensorDTO previous) {
        if (userId == null || current == null) {
            log.warn("check() chamado com parâmetros inválidos: userId={} current={}", userId, current);
            return Collections.emptyList();
        }

        // Obtém configuração atualizada
        UserConfig config = userConfigurationCache.getConfigForUser(userId);
        int currentConfigHash = config.hashCode(); // simples hash pra detectar mudanças

        // Verifica se precisa recriar detectores
        if (!userDetectorsMap.containsKey(userId)
                || !Objects.equals(userConfigHashMap.get(userId), currentConfigHash)) {

            recreateDetectors(userId, config);
        }

        List<AccidentDetector> detectors = userDetectorsMap.get(userId);
        if (detectors == null || detectors.isEmpty()) {
            return Collections.emptyList();
        }

        List<AccidentType> detectedAccidents = new ArrayList<>();
        for (AccidentDetector detector : detectors) {
            try {
                if (detector.detect(current, previous)) {
                    detectedAccidents.add(detector.getType());
                }
            } catch (Exception e) {
                log.error("Erro ao executar detector {} para o usuário {}", detector.getClass().getSimpleName(), userId, e);
            }
        }

        return detectedAccidents;
    }

    /**
     * Recria todos os detectores do usuário com base na configuração atual.
     */
    private void recreateDetectors(Long userId, UserConfig cfg) {
        List<AccidentDetector> detectors = new ArrayList<>();

        log.info("♻️ Recriando detectores do usuário {} com nova configuração...", userId);

        try {
            // if (cfg.getFall() != null && cfg.getFall().isEnabled()) {
            //     detectors.add(new FallDetector(cfg.getFall()));
            // }

            if (cfg.getImmobility() != null && cfg.getImmobility().isEnabled()) {
                detectors.add(new ProlongedImmobilityDetector(cfg.getImmobility()));
            }

            if (cfg.getGeofence() != null && cfg.getGeofence().isEnabled()) {
                detectors.add(new GeofenceRadarCircularDetector(cfg.getGeofence()));
            }

            userDetectorsMap.put(userId, detectors);
            userConfigHashMap.put(userId, cfg.hashCode());

            log.info("✅ Detectores do usuário {} recriados: {}", userId,
                    detectors.stream().map(d -> d.getClass().getSimpleName()).toList());
        } catch (Exception e) {
            log.error("Erro ao recriar detectores do usuário {}", userId, e);
        }
    }

    /**
     * Força a remoção e recriação dos detectores (usado após refresh manual).
     */
    public void refreshUserDetectors(Long userId) {
        userConfigurationCache.refreshConfig(userId); // recarrega config do DB
        UserConfig newConfig = userConfigurationCache.getConfigForUser(userId);
        recreateDetectors(userId, newConfig);
    }

    /**
     * Limpa todos os detectores de todos os usuários (caso queira reinicializar tudo).
     */
    public void clearAll() {
        userDetectorsMap.clear();
        userConfigHashMap.clear();
        log.warn("🧹 Todos os detectores foram limpos.");
    }
}
