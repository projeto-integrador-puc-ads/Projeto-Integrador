package com.example.carekeeper.service.detection.detector;

import com.example.carekeeper.interfaces.AccidentDetector;
import com.example.carekeeper.enums.AccidentType;
import com.example.carekeeper.dto.SensorDTO;
import com.example.carekeeper.util.EnvironmentUtil;
import com.example.carekeeper.pojo.UserConfig;
import com.example.carekeeper.enums.Sensitivity;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.ArrayDeque;
import java.util.Deque;

public class FallDetector implements AccidentDetector {

    private static final Logger log = LoggerFactory.getLogger(FallDetector.class);

    private static final double DEFAULT_FREE_FALL_THRESHOLD = 2.0;
    private static final double DEFAULT_IMPACT_THRESHOLD = 5.5;
    private static final double DEFAULT_IMMOBILITY_THRESHOLD = 1.2;
    private static final double DEFAULT_GYRO_THRESHOLD = 1.5;
    private static final int DEFAULT_READING_WINDOW = 50;
    private static final int DEFAULT_MIN_HISTORY_READINGS = 5;
    private static final long DEFAULT_IMMOBILITY_TIME_MS = 1500;
    private static final long DEFAULT_MAX_FALL_IMPACT_INTERVAL_MS = 800;

    private final boolean enabled;
    private final double freeFallThreshold;
    private final double impactThreshold;
    private final double immobilityThreshold;
    private final double gyroThreshold;
    private final int readingWindow;
    private final int minHistoryReadings;
    private final long immobilityTimeMs;
    private final long maxFallImpactIntervalMs;

    private Deque<SensorDTO> history;
    private SensorDTO lastDetectedFall = null;
    private boolean freeFallPhase = false;
    private boolean impactPhase = false;
    private long freeFallTimestamp = 0;
    private long impactTimestamp = 0;
    private final EnvironmentUtil envUtil;

    public FallDetector(UserConfig.Fall config, EnvironmentUtil envUtil) {
        this.envUtil = envUtil;
        UserConfig.Fall cfg = (config != null) ? config : new UserConfig.Fall();
        this.enabled = cfg.isEnabled();

        Sensitivity s = cfg.getSensitivity();
        double multiplier = (s != null) ? s.getMultiplier() : 1.0;

        this.freeFallThreshold = DEFAULT_FREE_FALL_THRESHOLD * multiplier;
        this.impactThreshold = DEFAULT_IMPACT_THRESHOLD * multiplier;
        this.immobilityThreshold = DEFAULT_IMMOBILITY_THRESHOLD * multiplier;
        this.gyroThreshold = DEFAULT_GYRO_THRESHOLD * multiplier;
        this.readingWindow = DEFAULT_READING_WINDOW;
        this.minHistoryReadings = DEFAULT_MIN_HISTORY_READINGS;
        this.immobilityTimeMs = DEFAULT_IMMOBILITY_TIME_MS;
        this.maxFallImpactIntervalMs = DEFAULT_MAX_FALL_IMPACT_INTERVAL_MS;

        this.history = new ArrayDeque<>(this.readingWindow);
        if (envUtil.isDev()) {
            log.debug("FallDetector config: enabled={} | sensitivity={} | multiplier={} | freeFallThreshold={} | impactThreshold={} | immobilityThreshold={} | gyroThreshold={} | readingWindow={} | minHistoryReadings={} | immobilityTimeMs={} | maxFallImpactIntervalMs={}",
                    this.enabled,
                    cfg.getSensitivity(),
                    multiplier,
                    this.freeFallThreshold,
                    this.impactThreshold,
                    this.immobilityThreshold,
                    this.gyroThreshold,
                    this.readingWindow,
                    this.minHistoryReadings,
                    this.immobilityTimeMs,
                    this.maxFallImpactIntervalMs
            );
        }
    }

    @Override
    public synchronized boolean detect(SensorDTO current, SensorDTO previous) {
        if (previous == null) {
            history.addLast(current);
            return false;
        }

        if (!enabled) return false;

        history.addLast(current);
        if (history.size() > readingWindow) history.pollFirst();
        if (history.size() < minHistoryReadings) return false;

        double ax = current.getAccelerometerX();
        double ay = current.getAccelerometerY();
        double az = current.getAccelerometerZ();
        double magAcc = Math.sqrt(ax*ax + ay*ay + az*az);

        double dax = ax - previous.getAccelerometerX();
        double day = ay - previous.getAccelerometerY();
        double daz = az - previous.getAccelerometerZ();
        double deltaAcc = Math.sqrt(dax*dax + day*day + daz*daz);

        double gx = current.getGyroscopeX();
        double gy = current.getGyroscopeY();
        double gz = current.getGyroscopeZ();
        double magGyro = Math.sqrt(gx*gx + gy*gy + gz*gz);

        long now = current.getTimestamp();

        if (!freeFallPhase && magAcc < freeFallThreshold) {
            freeFallPhase = true;
            freeFallTimestamp = now;
            if (envUtil.isDev()) log.info("🟡 Início de queda livre detectado.");
            return false;
        }

        if (freeFallPhase && !impactPhase && deltaAcc > impactThreshold) {
            if (now - freeFallTimestamp <= maxFallImpactIntervalMs) {
                impactPhase = true;
                impactTimestamp = now;
                if (envUtil.isDev()) log.info("🔴 Impacto detectado após queda livre.");
            }
            freeFallPhase = false;
        }

        if (impactPhase) {
            long timeSinceImpact = now - impactTimestamp;
            if (timeSinceImpact >= immobilityTimeMs) {
                double sum = 0;
                int count = 0;
                for (SensorDTO s : history) {
                    if (s.getTimestamp() >= impactTimestamp) {
                        double sx = s.getAccelerometerX();
                        double sy = s.getAccelerometerY();
                        double sz = s.getAccelerometerZ();
                        double mag = Math.sqrt(sx*sx + sy*sy + sz*sz);
                        sum += Math.abs(mag - 9.8);
                        count++;
                    }
                }
                double avgAccNoGravity = (count > 0) ? sum / count : 0.0;

                if (avgAccNoGravity < immobilityThreshold) {
                    if (lastDetectedFall == null || now - lastDetectedFall.getTimestamp() > immobilityTimeMs) {
                        lastDetectedFall = current;
                        impactPhase = false;
                        if (envUtil.isDev()) log.info("✅ Queda confirmada (imobilidade detectada).");
                        return true;
                    }
                }
                impactPhase = false;
                if (envUtil.isDev()) log.info("🔄 Fim da fase de impacto (sem imobilidade suficiente).");
            }
        }

        if (magGyro > gyroThreshold && envUtil.isDev()) {
            log.info("ℹ️ Movimento rotacional detectado: magGyro={}", magGyro);
        }

        return false;
    }

    @Override
    public synchronized AccidentType getType() {
        return AccidentType.FALL;
    }

    public synchronized void reset() {
        history.clear();
        lastDetectedFall = null;
        freeFallPhase = false;
        impactPhase = false;
        freeFallTimestamp = 0;
        impactTimestamp = 0;
        if (envUtil.isDev()) log.info("♻️ Detector de quedas resetado.");
    }
}
