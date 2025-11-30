package br.pucgo.ads.projetointegrador.carekeeper.service.detection.detector;

import br.pucgo.ads.projetointegrador.carekeeper.interfaces.AccidentDetector;
import br.pucgo.ads.projetointegrador.carekeeper.enums.AccidentType;
import br.pucgo.ads.projetointegrador.carekeeper.config.detection.UserConfig;
import br.pucgo.ads.projetointegrador.carekeeper.dto.SensorDTO;

import java.util.LinkedList;
import java.util.Queue;

public class GeofenceRadarCircularDetector implements AccidentDetector {

    private static final double EARTH_RADIUS_METERS = 6371000;
    private static final double HYSTERESIS_METERS = 5.0;
    private static final double MAX_SPEED_MPS = 10.0;
    private static final int MOVING_AVERAGE_SIZE = 5;
    private static final int RADAR_RADIUS = 10; // raio do radar em caracteres

    private final double centerLat;
    private final double centerLon;
    private final double radiusMeters;
    private final boolean enabled;

    private final Queue<SensorDTO> lastPositions = new LinkedList<>();

    public GeofenceRadarCircularDetector(UserConfig.Geofence config) {
        this.centerLat = (config != null) ? config.getCenterLat() : 0.0;
        this.centerLon = (config != null) ? config.getCenterLon() : 0.0;
        this.radiusMeters = (config != null) ? config.getRadiusMeters() : 100.0;
        this.enabled = config != null && config.isEnabled();
    }

    @Override
    public boolean detect(SensorDTO current, SensorDTO previous) {
        if (!enabled || current == null)
            return false;

        if (previous != null && !isValidMovement(current, previous))
            return false;

        // média móvel das últimas posições
        lastPositions.add(current);
        if (lastPositions.size() > MOVING_AVERAGE_SIZE) lastPositions.poll();
        double avgLat = lastPositions.stream().mapToDouble(SensorDTO::getLatitude).average().orElse(current.getLatitude());
        double avgLon = lastPositions.stream().mapToDouble(SensorDTO::getLongitude).average().orElse(current.getLongitude());

        double distance = calcularDistanciaEmMetros(centerLat, centerLon, avgLat, avgLon);
        double angle = Math.atan2(avgLat - centerLat, avgLon - centerLon);

        drawRadar(distance, angle);

        return distance > radiusMeters + HYSTERESIS_METERS;
    }

    @Override
    public AccidentType getType() {
        return AccidentType.OUT_OF_SAFE_ZONE;
    }

    private double calcularDistanciaEmMetros(double lat1, double lon1, double lat2, double lon2) {
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return EARTH_RADIUS_METERS * c;
    }

    private boolean isValidMovement(SensorDTO current, SensorDTO previous) {
        return calcularSpeed(current, previous) <= MAX_SPEED_MPS;
    }

    private double calcularSpeed(SensorDTO current, SensorDTO previous) {
        double distance = calcularDistanciaEmMetros(previous.getLatitude(), previous.getLongitude(),
                current.getLatitude(), current.getLongitude());
        double timeDiff = (current.getTimestamp() - previous.getTimestamp()) / 1000.0;
        if (timeDiff <= 0) return MAX_SPEED_MPS * 2;
        return distance / timeDiff;
    }

    /**
     * Desenha radar circular ASCII com cores, sem usar char[][] para cores.
     */
    private void drawRadar(double distance, double angle) {
        System.out.print("\033[H\033[2J"); // limpa tela
        System.out.flush();

        int size = RADAR_RADIUS * 2 + 1;
        int center = RADAR_RADIUS;

        // calcula posição do usuário no radar
        double ratio = Math.min(1.0, distance / radiusMeters);
        int userX = center + (int) Math.round(ratio * RADAR_RADIUS * Math.cos(angle));
        int userY = center + (int) Math.round(ratio * RADAR_RADIUS * Math.sin(angle));

        for (int y = 0; y < size; y++) {
            StringBuilder line = new StringBuilder();
            for (int x = 0; x < size; x++) {
                if (x == center && y == center) {
                    line.append("O"); // centro
                } else if (x == userX && y == userY) {
                    // usuário colorido
                    if (distance <= radiusMeters) {
                        line.append("\033[1;32m@\033[0m"); // verde
                    } else {
                        line.append("\033[1;31m@\033[0m"); // vermelho
                    }
                } else {
                    line.append("."); // ponto de fundo
                }
            }
            System.out.println(line);
        }
        System.out.printf("Distância do centro: %.2f m / Raio seguro: %.2f m%n", distance, radiusMeters);
    }
}
