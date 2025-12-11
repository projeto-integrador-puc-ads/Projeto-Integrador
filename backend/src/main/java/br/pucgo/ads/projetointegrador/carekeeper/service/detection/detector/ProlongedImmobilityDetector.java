package br.pucgo.ads.projetointegrador.carekeeper.service.detection.detector;

import br.pucgo.ads.projetointegrador.carekeeper.interfaces.AccidentDetector;
import br.pucgo.ads.projetointegrador.carekeeper.enums.AccidentType;
import br.pucgo.ads.projetointegrador.carekeeper.config.detection.UserConfig;
import br.pucgo.ads.projetointegrador.carekeeper.dto.SensorDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class ProlongedImmobilityDetector implements AccidentDetector {

    private static final Logger log = LoggerFactory.getLogger(ProlongedImmobilityDetector.class);

    private static final double MOVEMENT_THRESHOLD = 0.1; // antes 0.02 → mais estável
    private static final int WINDOW_SIZE = 10; // antes 5 → mais suavizado
    private static final int CALIBRATION_SAMPLES = 20; // ignora primeiras leituras

    private final boolean enabled;
    private final long timeLimitMs;

    private final SensorDTO[] window = new SensorDTO[WINDOW_SIZE];
    private int index = 0;
    private boolean windowFilled = false;
    private long startTime = 0;

    // Calibração inicial
    private int calibrationCount = 0;
    private double baselineAcc = 9.81; // valor padrão da gravidade
    private boolean calibrated = false;

    public ProlongedImmobilityDetector(UserConfig.Immobility config) {
        this.enabled = config.isEnabled();
        this.timeLimitMs = config.getTimeLimitMs();

        log.info("🧩 ProlongedImmobilityDetector inicializado | enabled={} | timeLimitMs={} | threshold={} | window={}",
                enabled, timeLimitMs, MOVEMENT_THRESHOLD, WINDOW_SIZE);
    }

    @Override
    public boolean detect(SensorDTO current, SensorDTO previous) {
        if (!enabled)
            return false;

        // 🔹 Calibração inicial — ignora primeiras leituras até estabilizar
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

        // Adiciona leitura na janela
        window[index] = current;
        index = (index + 1) % WINDOW_SIZE;
        if (index == 0)
            windowFilled = true;

        // Calcula delta médio na janela (removendo gravidade)
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

        // 🔹 Cria barras coloridas para visualização
        String accBar = getColoredBar(avgDeltaAcc);
        String gyroBar = getColoredBar(avgDeltaGyro);

        // Mensagem de movimento, se houver
        String movementNote = "";
        if (avgDeltaAcc >= MOVEMENT_THRESHOLD || avgDeltaGyro >= MOVEMENT_THRESHOLD) {
            startTime = 0;
            movementNote = "\033[1;34m🌀 Movimento detectado, resetando contagem\033[0m";
        }

        // 🔹 Log principal (print direto no console)
        System.out.print("\rΔAcc " + accBar + " " + String.format("%.5f", avgDeltaAcc)
                + " | ΔGyro " + gyroBar + " " + String.format("%.5f", avgDeltaGyro)
                + " | Janela " + count + "/" + WINDOW_SIZE + " " + movementNote);
        System.out.flush();

        // Checa imobilidade prolongada
        if (avgDeltaAcc < MOVEMENT_THRESHOLD && avgDeltaGyro < MOVEMENT_THRESHOLD) {
            if (startTime == 0)
                startTime = now;
            if (now - startTime >= timeLimitMs) {
                System.out.println("\n\033[1;41m⚠️ IMOBILIDADE PROLONGADA DETECTADA! Tempo: "
                        + (now - startTime) + " ms\033[0m");
                return true;
            }
        }

        return false;
    }

    /**
     * Calcula magnitude da aceleração.
     */
    private double magnitude(SensorDTO s) {
        return Math.sqrt(
                Math.pow(s.getAccelerometerX(), 2) +
                Math.pow(s.getAccelerometerY(), 2) +
                Math.pow(s.getAccelerometerZ(), 2)
        );
    }

    /**
     * Gera uma barra colorida com base na intensidade do valor.
     */
    private String getColoredBar(double value) {
        int length = Math.min(20, (int) (value / MOVEMENT_THRESHOLD * 10));
        StringBuilder bar = new StringBuilder();
        String color;

        if (value < MOVEMENT_THRESHOLD)
            color = "\033[1;32m"; // verde: pouco movimento
        else if (value < MOVEMENT_THRESHOLD * 3)
            color = "\033[1;33m"; // amarelo: médio
        else
            color = "\033[1;31m"; // vermelho: alto

        bar.append(color);
        for (int i = 0; i < length; i++)
            bar.append("█");
        for (int i = length; i < 20; i++)
            bar.append(" ");
        bar.append("\033[0m");
        return "|" + bar + "|";
    }

    @Override
    public AccidentType getType() {
        return AccidentType.IMMOBILITY;
    }
}
