package br.pucgo.ads.projetointegrador.carekeeper.service.detection.detector;

import br.pucgo.ads.projetointegrador.carekeeper.interfaces.AccidentDetector;
import br.pucgo.ads.projetointegrador.carekeeper.enums.AccidentType;
import br.pucgo.ads.projetointegrador.carekeeper.config.detection.UserConfig;
import br.pucgo.ads.projetointegrador.carekeeper.dto.SensorDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class ProlongedImmobilityDetector implements AccidentDetector {

    private static final Logger log = LoggerFactory.getLogger(ProlongedImmobilityDetector.class);

    private static final double MOVEMENT_THRESHOLD = 0.1;
    private static final int WINDOW_SIZE = 10;
    private static final int CALIBRATION_SAMPLES = 20;

    private final boolean enabled;
    private final long timeLimitMs;

    private final SensorDTO[] window = new SensorDTO[WINDOW_SIZE];
    private int index = 0;
    private boolean windowFilled = false;
    private long startTime = 0;

    private int calibrationCount = 0;
    private double baselineAcc = 9.81;
    private boolean calibrated = false;

    public ProlongedImmobilityDetector(UserConfig.Immobility config) {
        this.enabled = config.isEnabled();
        this.timeLimitMs = config.getTimeLimitMs();
        log.info("🧩 ProlongedImmobilityDetector inicializado | enabled={} | timeLimitMs={}", enabled, timeLimitMs);
    }

    @Override
    public boolean detect(SensorDTO current, SensorDTO previous) {
        if (!enabled)
            return false;

        if (!calibrated) {
            if (calibrationCount < CALIBRATION_SAMPLES) {
                calibrationCount++;
                if (current != null) {
                    double mag = magnitude(current);
                    baselineAcc = ((baselineAcc * (calibrationCount - 1)) + mag) / calibrationCount;
                }
                if (calibrationCount == CALIBRATION_SAMPLES) {
                    calibrated = true;
                    log.info("✅ Calibração concluída. baselineAcc={}", String.format("%.3f", baselineAcc));
                }
                return false;
            }
        }

        window[index] = current;
        index = (index + 1) % WINDOW_SIZE;
        if (index == 0) windowFilled = true;

        int count = windowFilled ? WINDOW_SIZE : index;
        double avgDeltaAcc = 0;
        double avgDeltaGyro = 0;

        for (int i = 1; i < count; i++) {
            SensorDTO prev = window[i - 1];
            SensorDTO curr = window[i];
            double prevAcc = Math.abs(magnitude(prev) - baselineAcc);
            double currAcc = Math.abs(magnitude(curr) - baselineAcc);
            avgDeltaAcc += Math.abs(currAcc - prevAcc);
            avgDeltaGyro += Math.sqrt(
                    Math.pow(curr.getGyroscopeX() - prev.getGyroscopeX(), 2) +
                    Math.pow(curr.getGyroscopeY() - prev.getGyroscopeY(), 2) +
                    Math.pow(curr.getGyroscopeZ() - prev.getGyroscopeZ(), 2));
        }

        avgDeltaAcc /= Math.max(count - 1, 1);
        avgDeltaGyro /= Math.max(count - 1, 1);

        long now = current.getTimestamp();

        if (avgDeltaAcc < MOVEMENT_THRESHOLD && avgDeltaGyro < MOVEMENT_THRESHOLD) {
            if (startTime == 0)
                startTime = now;
            if (now - startTime >= timeLimitMs) {
                log.warn("⚠️ IMOBILIDADE PROLONGADA DETECTADA! Tempo: {} ms", (now - startTime));
                return true;
            }
        } else {
            startTime = 0;
        }

        return false;
    }

    private double magnitude(SensorDTO s) {
        return Math.sqrt(
                Math.pow(s.getAccelerometerX(), 2) +
                Math.pow(s.getAccelerometerY(), 2) +
                Math.pow(s.getAccelerometerZ(), 2)
        );
    }

    @Override
    public AccidentType getType() {
        return AccidentType.IMMOBILITY;
    }
}
