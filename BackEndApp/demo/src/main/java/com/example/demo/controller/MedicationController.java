package com.example.demo.controller;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import java.time.LocalTime;
import java.util.Collection;
import java.util.List;


@RestController
@RequestMapping("/api/medications")
public class MedicationController {

    private final MedicationService service;

    public MedicationController(MedicationService service) {
        this.service = service;
    }

    /**
     * Cria novo medicamento.
     * Exemplo de JSON esperado no corpo:
     * {
     *   "name": "Paracetamol",
     *   "imageUrl": "http://exemplo.com/img/paracetamol.jpg",
     *   "pillsPerPack": 20,
     *   "scheduleTimes": ["08:00", "14:00", "20:00"],
     *   "important": true,
     *   "emergencyContact": "+5511999999999",
     *   "lowStockThreshold": 0.2
     * }
     */
    @PostMapping
    public ResponseEntity<Medication> create(@RequestBody MedicationDto dto) {
        // Converte DTO para entidade
        Medication med = dto.toEntity();
        Medication created = service.createMedication(med);
        return ResponseEntity.ok(created);
    }

    /**
     * Retorna lista de todos os medicamentos.
     */
    @GetMapping
    public ResponseEntity<Collection<Medication>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }


    @GetMapping("/{id}")
    public ResponseEntity<Medication> getById(@PathVariable String id) {
        return ResponseEntity.ok(service.getById(id));
    }


    @PutMapping("/{id}")
    public ResponseEntity<Medication> update(@PathVariable String id, @RequestBody MedicationDto dto) {
        Medication med = dto.toEntity();
        Medication updated = service.updateMedication(id, med);
        return ResponseEntity.ok(updated);
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Marca que o usuário tomou a dose no horário atual (parâmetro 'now').
     * Exemplo de chamada: POST /api/medications/{id}/take?now=14:00
     */
    @PostMapping("/{id}/take")
    public ResponseEntity<Medication> takeDose(
            @PathVariable String id,
            @RequestParam @DateTimeFormat(pattern = "HH:mm") LocalTime now) {
        Medication medAfter = service.takeDose(id, now);
        return ResponseEntity.ok(medAfter);
    }

    /**
     * Verifica se há dose pendente para hoje (apenas retorna horários futuros no dia).
     * Chamada: GET /api/medications/{id}/pending?now=10:30
     */
    @GetMapping("/{id}/pending")
    public ResponseEntity<List<LocalTime>> getPending(
            @PathVariable String id,
            @RequestParam @DateTimeFormat(pattern = "HH:mm") LocalTime now) {
        Medication med = service.getById(id);
        var pendings = service.getPendingDosesToday(med, now).stream().toList();
        return ResponseEntity.ok(pendings);
    }

    /**
     * Verifica se a dose está próxima (dentro de +/- 15 minutos).
     * GET /api/medications/{id}/due?now=07:50
     */
    @GetMapping("/{id}/due")
    public ResponseEntity<Boolean> isDue(
            @PathVariable String id,
            @RequestParam @DateTimeFormat(pattern = "HH:mm") LocalTime now) {
        Medication med = service.getById(id);
        boolean due = service.isDoseDueSoon(med, now);
        return ResponseEntity.ok(due);
    }
}