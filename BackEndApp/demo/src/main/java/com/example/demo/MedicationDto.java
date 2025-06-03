package com.example.demo;

import com.example.demo.model.Medication;   // <-- corrige o pacote aqui
import lombok.Data;

import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * DTO usado nos endpoints para criar/atualizar Medication via JSON.
 */
@Data
public class MedicationDto {
    private String name;
    private String imageUrl;
    private int pillsPerPack;
    private List<String> scheduleTimes; // Ex.: ["08:00","14:00"]
    private boolean important;
    private String emergencyContact;
    private double lowStockThreshold;

    /**
     * Converte este DTO em entidade Medication.
     */
    public Medication toEntity() {
        // Converte cada string de horário para LocalTime
        List<LocalTime> times = scheduleTimes.stream()
                .map(LocalTime::parse)
                .collect(Collectors.toList());

        Medication med = new Medication(
                this.name,
                this.imageUrl,
                this.pillsPerPack,
                times,
                this.important,
                this.emergencyContact,
                this.lowStockThreshold
        );
        return med;
    }
}
