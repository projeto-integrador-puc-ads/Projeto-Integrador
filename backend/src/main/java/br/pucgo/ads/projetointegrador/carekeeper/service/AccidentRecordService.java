package br.pucgo.ads.projetointegrador.carekeeper.service;

import br.pucgo.ads.projetointegrador.carekeeper.dto.AccidentLocationDTO;
import br.pucgo.ads.projetointegrador.carekeeper.dto.AccidentTypeCountDTO;
import br.pucgo.ads.projetointegrador.carekeeper.entity.AccidentRecordEntity;
import br.pucgo.ads.projetointegrador.carekeeper.repository.AccidentRecordRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;

import java.time.*;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AccidentRecordService {

    private final AccidentRecordRepository accidentRecordRepository;
    private final ObjectMapper objectMapper;

    public AccidentRecordService(AccidentRecordRepository accidentRecordRepository, ObjectMapper objectMapper) {
        this.accidentRecordRepository = accidentRecordRepository;
        this.objectMapper = objectMapper;
    }

    // -------------------
    // CRUD
    // -------------------

    public List<AccidentRecordEntity> findAll() {
        return accidentRecordRepository.findAll();
    }

    public List<AccidentRecordEntity> findByUserId(Long userId) {
        return accidentRecordRepository.findByUserId(userId);
    }

    @SuppressWarnings("null")
    public AccidentRecordEntity save(AccidentRecordEntity record) {
        return accidentRecordRepository.save(record);
    }

    @SuppressWarnings("null")
    public void deleteById(Long id) {
        accidentRecordRepository.deleteById(id);
    }

    
    public Long getTotalRecords(Long userId) {
        if (userId != null)
            return accidentRecordRepository.countByUserId(userId);
        return accidentRecordRepository.count();
    }

    public Long getAccidentsToday(Long userId) {
        LocalDate today = LocalDate.now();
        long startOfDay = today.atStartOfDay().toInstant(ZoneOffset.UTC).toEpochMilli();
        long endOfDay = today.plusDays(1).atStartOfDay().minusNanos(1).toInstant(ZoneOffset.UTC).toEpochMilli();

        if (userId != null)
            return accidentRecordRepository.countByUserIdAndDetectedAtBetween(userId, startOfDay, endOfDay);
        return accidentRecordRepository.countByDetectedAtBetween(startOfDay, endOfDay);
    }

    public List<AccidentLocationDTO> getAcidentesLocalizacao(Long userId) {
        List<AccidentRecordEntity> records = userId != null
                ? accidentRecordRepository.findByUserId(userId)
                : accidentRecordRepository.findAll();

        return records.stream()
                .map(record -> {
                    double lat = 0.0, lon = 0.0;
                    try {
                        JsonNode json = objectMapper.readTree(record.getSensorJson());
                        if (json.has("latitude")) lat = json.get("latitude").asDouble();
                        if (json.has("longitude")) lon = json.get("longitude").asDouble();
                    } catch (Exception ignored) {}
                    String tipo = record.getAccidentType() != null ? record.getAccidentType().getTitle() : "Desconhecido";
                    return new AccidentLocationDTO(lat, lon, tipo, record.getDetectedAt());
                })
                .collect(Collectors.toList());
    }

    public int[] getAcidentesPorHorario(Long userId) {
        List<AccidentRecordEntity> records = userId != null
                ? accidentRecordRepository.findByUserId(userId)
                : accidentRecordRepository.findAll();

        int[] intervals = new int[12];
        for (AccidentRecordEntity record : records) {
            LocalDateTime dt = LocalDateTime.ofInstant(Instant.ofEpochMilli(record.getDetectedAt()), ZoneOffset.UTC);
            intervals[dt.getHour() / 2]++;
        }
        return intervals;
    }

    public List<AccidentTypeCountDTO> getAcidentesPorTipo(Long userId) {
        List<AccidentRecordEntity> records = userId != null
                ? accidentRecordRepository.findByUserId(userId)
                : accidentRecordRepository.findAll();

        return records.stream()
                .collect(Collectors.groupingBy(
                        r -> r.getAccidentType() != null ? r.getAccidentType().getTitle() : "Outro",
                        Collectors.counting()
                ))
                .entrySet().stream()
                .map(e -> new AccidentTypeCountDTO(e.getKey(), e.getValue()))
                .collect(Collectors.toList());
    }

    public int[][] getHeatmapData(Long userId) {
        List<AccidentRecordEntity> records = userId != null
                ? accidentRecordRepository.findByUserId(userId)
                : accidentRecordRepository.findAll();

        int[][] heatmap = new int[7][24];
        for (AccidentRecordEntity record : records) {
            LocalDateTime dt = Instant.ofEpochMilli(record.getDetectedAt())
                    .atZone(ZoneId.systemDefault())
                    .toLocalDateTime();
            int day = dt.getDayOfWeek().getValue() % 7;
            int hour = dt.getHour();
            heatmap[day][hour]++;
        }
        return heatmap;
    }
}
