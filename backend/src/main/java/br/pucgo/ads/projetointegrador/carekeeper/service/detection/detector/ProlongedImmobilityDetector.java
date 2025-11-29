package com.example.carekeeper.service.detection.detector;

import com.example.carekeeper.interfaces.AccidentDetector;
import com.example.carekeeper.enums.AccidentType;
import com.example.carekeeper.dto.SensorDTO;
import com.example.carekeeper.util.EnvironmentUtil;
import com.example.carekeeper.pojo.UserConfig;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class ProlongedImmobilityDetector implements AccidentDetector {

    private static final Logger log = LoggerFactory.getLogger(ProlongedImmobilityDetector.class);
    private static final double MOVEMENT_THRESHOLD = 0.02;

    private final boolean enabled;
    private final long timeLimitMs;
    private SensorDTO initialReading;
    private long initialTime;
    private final EnvironmentUtil envUtil;

    public ProlongedImmobilityDetector(UserConfig.Immobility config, EnvironmentUtil envUtil) {
        this.envUtil = envUtil;
        this.enabled = config.isEnabled();
        this.timeLimitMs = config.getTimeLimitMs();
        if (envUtil.isDev()) {
            log.debug("ProlongedImmobilityDetector config: enabled={} | timeLimitMs={} | movementThreshold={}",
                    this.enabled,
                    this.timeLimitMs,
                    MOVEMENT_THRESHOLD);
        }
    }

    @Override
    public boolean detect(SensorDTO current, SensorDTO previous) {
        if (!enabled) return false;

        if (initialReading == null) { 
            initialReading = current;
            initialTime = current.getTimestamp();
            if (envUtil.isDev()) log.debug("📍 Primeira leitura registrada. Tempo inicial: {}", initialTime);
            return false;
        }

        double deltaAcc = Math.sqrt(
                Math.pow(current.getAccelerometerX() - initialReading.getAccelerometerX(), 2) +
                Math.pow(current.getAccelerometerY() - initialReading.getAccelerometerY(), 2) +
                Math.pow(current.getAccelerometerZ() - initialReading.getAccelerometerZ(), 2)
        );

        double deltaGyro = Math.sqrt(
                Math.pow(current.getGyroscopeX() - initialReading.getGyroscopeX(), 2) +
                Math.pow(current.getGyroscopeY() - initialReading.getGyroscopeY(), 2) +
                Math.pow(current.getGyroscopeZ() - initialReading.getGyroscopeZ(), 2)
        );

        long deltaTime = current.getTimestamp() - initialTime;

        if (envUtil.isDev()) {
            log.debug("ΔAcc={} | ΔGyro={} | ΔTempo={} ms | Limite={} ms",
                    String.format("%.5f", deltaAcc),
                    String.format("%.5f", deltaGyro),
                    deltaTime,
                    timeLimitMs);
        }

        if (deltaAcc < MOVEMENT_THRESHOLD && deltaGyro < MOVEMENT_THRESHOLD) {
            if (deltaTime >= timeLimitMs) {
                if (envUtil.isDev()) log.warn("⚠️ Imobilidade prolongada detectada! Tempo: {} ms", deltaTime);
                return true;
            } else {
                if (envUtil.isDev()) log.debug("Pouco movimento, mas dentro do limite. Mantendo observação...");
                return false;
            }
        } else {
            if (envUtil.isDev()) log.info("🌀 Movimento detectado (ΔAcc={}, ΔGyro={}). Resetando tempo.",
                    String.format("%.5f", deltaAcc),
                    String.format("%.5f", deltaGyro));
            initialReading = current;
            initialTime = current.getTimestamp();
            return false;
        }
    }

    @Override
    public AccidentType getType() {
        return AccidentType.IMMOBILITY;
    }
}
