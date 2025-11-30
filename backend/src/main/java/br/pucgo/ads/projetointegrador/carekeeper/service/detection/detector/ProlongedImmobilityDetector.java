package br.pucgo.ads.projetointegrador.carekeeper.service.detection.detector;

import br.pucgo.ads.projetointegrador.carekeeper.interfaces.AccidentDetector;
import br.pucgo.ads.projetointegrador.carekeeper.enums.AccidentType;
import br.pucgo.ads.projetointegrador.carekeeper.config.detection.UserConfig;
import br.pucgo.ads.projetointegrador.carekeeper.dto.SensorDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class ProlongedImmobilityDetector implements AccidentDetector {

    private static final Logger log = LoggerFactory.getLogger(ProlongedImmobilityDetector.class);
    private static final double MOVEMENT_THRESHOLD = 0.02;
    private static final int WINDOW_SIZE = 5;

    private final boolean enabled;
    private final long timeLimitMs;

    private final SensorDTO[] window = new SensorDTO[WINDOW_SIZE];
    private int index = 0;
    private boolean windowFilled = false;
    private long startTime = 0;

    public ProlongedImmobilityDetector(UserConfig.Immobility config) {
        this.enabled = config.isEnabled();
        this.timeLimitMs = config.getTimeLimitMs();

        log.debug(
                "ProlongedImmobilityDetector config: enabled={} | timeLimitMs={} | movementThreshold={} | windowSize={}",
                enabled, timeLimitMs, MOVEMENT_THRESHOLD, WINDOW_SIZE);
    }

    @Override
    public boolean detect(SensorDTO current, SensorDTO previous) {
        if (!enabled)
            return false;

        // Adiciona leitura na janela
        window[index] = current;
        index = (index + 1) % WINDOW_SIZE;
        if (index == 0)
            windowFilled = true;

        // Calcula delta médio na janela
        int count = windowFilled ? WINDOW_SIZE : index;
        double avgDeltaAcc = 0;
        double avgDeltaGyro = 0;
        for (int i = 1; i < count; i++) {
            SensorDTO prev = window[i - 1];
            SensorDTO curr = window[i];
            avgDeltaAcc += Math.sqrt(
                    Math.pow(curr.getAccelerometerX() - prev.getAccelerometerX(), 2) +
                            Math.pow(curr.getAccelerometerY() - prev.getAccelerometerY(), 2) +
                            Math.pow(curr.getAccelerometerZ() - prev.getAccelerometerZ(), 2));
            avgDeltaGyro += Math.sqrt(
                    Math.pow(curr.getGyroscopeX() - prev.getGyroscopeX(), 2) +
                            Math.pow(curr.getGyroscopeY() - prev.getGyroscopeY(), 2) +
                            Math.pow(curr.getGyroscopeZ() - prev.getGyroscopeZ(), 2));
        }
        avgDeltaAcc /= Math.max(count - 1, 1);
        avgDeltaGyro /= Math.max(count - 1, 1);

        // 🔹 Cria barras coloridas para visualização
        String accBar = getColoredBar(avgDeltaAcc, 0.1);
        String gyroBar = getColoredBar(avgDeltaGyro, 0.1);

        long now = current.getTimestamp();

        // Mensagem de movimento, se houver
        String movementNote = "";
        if (avgDeltaAcc >= MOVEMENT_THRESHOLD || avgDeltaGyro >= MOVEMENT_THRESHOLD) {
            startTime = 0;
            movementNote = "\033[1;34m🌀 Movimento detectado, resetando contagem\033[0m";
        }

        // 🔹 Log principal sempre atualizado na mesma linha
        System.out.print("\rΔAcc " + accBar + " " + String.format("%.5f", avgDeltaAcc)
                + " | ΔGyro " + gyroBar + " " + String.format("%.5f", avgDeltaGyro)
                + " | Janela " + count + "/" + WINDOW_SIZE + " " + movementNote);

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
     * Gera uma barra colorida com base na intensidade do valor.
     */
    private String getColoredBar(double value, double scale) {
        int length = Math.min(20, (int) (value / scale * 20));
        StringBuilder bar = new StringBuilder();
        String color;

        // Determina a cor da barra
        if (value < MOVEMENT_THRESHOLD)
            color = "\033[1;32m"; // verde: pouco movimento
        else if (value < MOVEMENT_THRESHOLD * 5)
            color = "\033[1;33m"; // amarelo: médio
        else
            color = "\033[1;31m"; // vermelho: alto

        bar.append(color);
        for (int i = 0; i < length; i++)
            bar.append("█");
        for (int i = length; i < 20; i++)
            bar.append(" ");
        bar.append("\033[0m"); // reset da cor
        return "|" + bar + "|";
    }

    @Override
    public AccidentType getType() {
        return AccidentType.IMMOBILITY;
    }
}
