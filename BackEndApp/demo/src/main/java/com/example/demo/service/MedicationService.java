package com.example.demo.service;
import com.example.medbackend.model.Medication;
import com.example.medbackend.repository.MedicationRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Collection;
import java.util.Optional;


@Service
public class MedicationService {

    private final MedicationRepository repository;

    public MedicationService(MedicationRepository repository) {
        this.repository = repository;
    }


    public Medication createMedication(Medication medication) {
        repository.findByName(medication.getName())
                .ifPresent(m -> {
                    throw new IllegalArgumentException("Medication with name already exists");
                });
        return repository.save(medication);
    }


    public Medication updateMedication(String id, Medication updated) {
        Medication existing = repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Medication not found"));

        existing.setName(updated.getName());
        existing.setImageUrl(updated.getImageUrl());
        existing.setPillsPerPack(updated.getPillsPerPack());
        existing.setScheduleTimes(updated.getScheduleTimes());
        existing.setImportant(updated.isImportant());
        existing.setEmergencyContact(updated.getEmergencyContact());
        existing.setLowStockThreshold(updated.getLowStockThreshold());

        int diff = updated.getPillsPerPack() - existing.getPillsPerPack();
        existing.setCurrentPillsCount(Math.max(0, existing.getCurrentPillsCount() + diff));
        existing.setDosesPerDay(updated.getScheduleTimes().size());
        repository.save(existing);
        return existing;
    }

    /**
     * Retorna todos os medicamentos cadastrados.
     */
    public Collection<Medication> getAll() {
        return repository.findAll();
    }

    /**
     * Retorna um medicamento pelo ID.
     */
    public Medication getById(String id) {
        return repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Medication not found"));
    }

    /**
     * Deleta um medicamento por ID.
     */
    public void delete(String id) {
        repository.deleteById(id);
    }


    public Medication takeDose(String id, LocalTime now) {
        Medication med = repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Medication not found"));
        if (med.getCurrentPillsCount() <= 0) {
            throw new IllegalStateException("No pills remaining");
        }

        med.setCurrentPillsCount(med.getCurrentPillsCount() - 1);


        double fractionLeft = (double) med.getCurrentPillsCount() / med.getPillsPerPack();
        if (!med.isAlertedLowStock() && fractionLeft <= med.getLowStockThreshold()) {
            med.setAlertedLowStock(true);

        }

        repository.save(med);
        return med;
    }


    public boolean isDoseDueSoon(Medication med, LocalTime now) {
        for (LocalTime sched : med.getScheduleTimes()) {
            if (Math.abs(now.toSecondOfDay() - sched.toSecondOfDay()) <= 15 * 60) {
                return true;
            }
        }
        return false;
    }


    public Collection<LocalTime> getPendingDosesToday(Medication med, LocalTime now) {
        return med.getScheduleTimes().stream()
                .filter(time -> time.isAfter(now))
                .toList();
    }


}