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

    private static final long WARM_UP_TIME_MS = 5000; // 5 segundos de aquecimento global

    // Detectores ativos por usuário
    private final Map<Long, List<AccidentDetector>> userDetectorsMap = new ConcurrentHashMap<>();

    // Hash da configuração atual por usuário
    private final Map<Long, Integer> userConfigHashMap = new ConcurrentHashMap<>();

    // Momento de início do monitoramento por usuário
    private final Map<Long, Long> userStartTimestamps = new ConcurrentHashMap<>();

    // Controle de log por usuário (para não repetir logs)
    private final Set<Long> usersInWarmup = ConcurrentHashMap.newKeySet();

    private boolean systemLoaded = false;

    public AccidentDetection(UserConfigurationCache userConfigurationCache) {
        this.userConfigurationCache = userConfigurationCache;
        log.info("🚀 Inicializando sistema de detecção de acidentes...");
    }

    /**
     * Verifica acidentes para um usuário com base na leitura atual.
     * Controla o período de warm-up global e recria detectores se necessário.
     */
    public List<AccidentType> check(Long userId, SensorDTO current, SensorDTO previous) {
        if (userId == null || current == null) {
            log.warn("check() chamado com parâmetros inválidos: userId={} current={}", userId, current);
            return Collections.emptyList();
        }

        // Loga carregamento global apenas na primeira execução
        if (!systemLoaded) {
            log.info("⚙️ Carregando detectores ativos e configurações iniciais...");
            systemLoaded = true;
        }

        // Verifica se o usuário está em warm-up
        if (isInWarmUp(userId)) {
            return Collections.emptyList();
        }

        // Obtém configuração atualizada
        UserConfig config = userConfigurationCache.getConfigForUser(userId);
        int currentConfigHash = config.hashCode();

        // Recria detectores se a configuração mudou
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
     * Controla o warm-up por usuário — impede a detecção até o tempo mínimo.
     */
    private boolean isInWarmUp(Long userId) {
        long now = System.currentTimeMillis();

        // Inicia o timer se for o primeiro acesso do usuário
        if (!userStartTimestamps.containsKey(userId)) {
            userStartTimestamps.put(userId, now);
            usersInWarmup.add(userId);
            log.info("🕒 Iniciando warm-up de {} ms para o usuário {}...", WARM_UP_TIME_MS, userId);
            return true;
        }

        long elapsed = now - userStartTimestamps.get(userId);
        if (elapsed < WARM_UP_TIME_MS) {
            long remaining = (WARM_UP_TIME_MS - elapsed) / 1000;
            log.debug("Usuário {} em warm-up... ({} s restantes)", userId, remaining);
            return true;
        }

        // Conclui warm-up
        if (usersInWarmup.contains(userId)) {
            usersInWarmup.remove(userId);
            log.info("✅ Warm-up concluído — detectores ativos para o usuário {}.", userId);
        }

        return false;
    }

    /**
     * Recria todos os detectores do usuário com base na configuração atual.
     */
    private void recreateDetectors(Long userId, UserConfig cfg) {
        List<AccidentDetector> detectors = new ArrayList<>();

        log.info("♻️ Recriando detectores do usuário {} com nova configuração...", userId);

        try {
            if (cfg.getFall() != null && cfg.getFall().isEnabled()) {
                detectors.add(new FallDetector(cfg.getFall()));
            }

            if (cfg.getImmobility() != null && cfg.getImmobility().isEnabled()) {
                detectors.add(new ProlongedImmobilityDetector(cfg.getImmobility()));
            }

            if (cfg.getGeofence() != null && cfg.getGeofence().isEnabled()) {
                detectors.add(new GeofenceRadarCircularDetector(cfg.getGeofence()));
            }

            userDetectorsMap.put(userId, detectors);
            userConfigHashMap.put(userId, cfg.hashCode());
            userStartTimestamps.put(userId, System.currentTimeMillis());
            usersInWarmup.add(userId);

            log.info("✅ Detectores recriados para o usuário {}: {}", userId,
                    detectors.stream().map(d -> d.getClass().getSimpleName()).toList());
        } catch (Exception e) {
            log.error("Erro ao recriar detectores do usuário {}", userId, e);
        }
    }

    /**
     * Força a atualização dos detectores de um usuário específico.
     */
    public void refreshUserDetectors(Long userId) {
        userConfigurationCache.refreshConfig(userId);
        UserConfig newConfig = userConfigurationCache.getConfigForUser(userId);
        recreateDetectors(userId, newConfig);
    }

    /**
     * Limpa todos os detectores e configurações de warm-up.
     */
    public void clearAll() {
        userDetectorsMap.clear();
        userConfigHashMap.clear();
        userStartTimestamps.clear();
        usersInWarmup.clear();
        systemLoaded = false;
        log.warn("🧹 Todos os detectores e temporizadores foram limpos.");
    }
}
