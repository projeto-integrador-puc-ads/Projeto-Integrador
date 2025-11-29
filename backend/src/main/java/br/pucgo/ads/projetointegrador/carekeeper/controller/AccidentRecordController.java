package com.example.carekeeper.controller;

import com.example.carekeeper.model.AccidentRecordEntity;
import com.example.carekeeper.dto.AccidentLocationDTO;
import com.example.carekeeper.dto.AccidentTypeCountDTO;
import com.example.carekeeper.service.AccidentRecordService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/registros-acidentes")
public class AccidentRecordController {

    private final AccidentRecordService service;

    public AccidentRecordController(AccidentRecordService service) {
        this.service = service;
    }

    // -------------------
    // Operações CRUD básicas
    // -------------------

    /**
     * Retorna todos os registros de acidentes.
     * Exemplo: GET /api/registros-acidentes
     */
    @GetMapping
    public List<AccidentRecordEntity> buscarTodos() {
        return service.findAll();
    }

    /**
     * Retorna todos os registros de acidentes de um usuário específico.
     * Exemplo: GET /api/registros-acidentes/usuario/{userId}
     */
    @GetMapping("/usuario/{userId}")
    public List<AccidentRecordEntity> buscarPorUsuario(@PathVariable UUID userId) {
        return service.findByUserId(userId);
    }

    /**
     * Salva um novo registro de acidente.
     * Exemplo: POST /api/registros-acidentes
     */
    @PostMapping
    public AccidentRecordEntity salvar(@RequestBody AccidentRecordEntity record) {
        return service.save(record);
    }

    /**
     * Remove um registro de acidente pelo ID.
     * Exemplo: DELETE /api/registros-acidentes/{id}
     */
    @DeleteMapping("/{id}")
    public void deletar(@PathVariable Long id) {
        service.deleteById(id);
    }

    // -------------------
    // Endpoints do Dashboard
    // -------------------

    /**
     * Retorna o total de registros de acidentes, com ou sem filtro de usuário.
     * Exemplo: GET /api/registros-acidentes/total-registros?userId={id}
     */
    @GetMapping("/total-registros")
    public Long totalRegistros(@RequestParam(required = false) UUID userId) {
        return service.getTotalRecords(userId);
    }

    /**
     * Retorna o total de acidentes ocorridos hoje, com ou sem filtro de usuário.
     * Exemplo: GET /api/registros-acidentes/acidentes-hoje?userId={id}
     */
    @GetMapping("/acidentes-hoje")
    public Long acidentesHoje(@RequestParam(required = false) UUID userId) {
        return service.getAccidentsToday(userId);
    }

    /**
     * Retorna a localização dos acidentes (para exibição no mapa),
     * com ou sem filtro de usuário.
     * Exemplo: GET /api/registros-acidentes/localizacao?userId={id}
     */
    @GetMapping("/localizacao")
    public List<AccidentLocationDTO> getAcidentesLocalizacao(@RequestParam(required = false) UUID userId) {
        return service.getAcidentesLocalizacao(userId);
    }

    /**
     * Retorna os dados de acidentes agrupados por horário (intervalos de 2h),
     * com ou sem filtro de usuário.
     * Exemplo: GET /api/registros-acidentes/por-horario?userId={id}
     */
    @GetMapping("/por-horario")
    public int[] getAcidentesPorHorario(@RequestParam(required = false) UUID userId) {
        return service.getAcidentesPorHorario(userId);
    }

    /**
     * Retorna os dados de acidentes agrupados por tipo,
     * com ou sem filtro de usuário.
     * Exemplo: GET /api/registros-acidentes/por-tipo?userId={id}
     */
    @GetMapping("/por-tipo")
    public List<AccidentTypeCountDTO> getAcidentesPorTipo(@RequestParam(required = false) UUID userId) {
        return service.getAcidentesPorTipo(userId);
    }

    /**
     * Retorna os dados do heatmap (matriz dia da semana x hora do dia),
     * com ou sem filtro de usuário.
     * Exemplo: GET /api/registros-acidentes/heatmap?userId={id}
     */
    @GetMapping("/heatmap")
    public int[][] getAcidentesHeatmap(@RequestParam(required = false) UUID userId) {
        return service.getHeatmapData(userId);
    }
}
