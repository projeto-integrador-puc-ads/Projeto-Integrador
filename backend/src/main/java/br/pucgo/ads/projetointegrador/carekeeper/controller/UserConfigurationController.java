package br.pucgo.ads.projetointegrador.carekeeper.controller;

import br.pucgo.ads.projetointegrador.carekeeper.config.detection.UserConfig;
import br.pucgo.ads.projetointegrador.carekeeper.entity.ConfigurationEntity;
import br.pucgo.ads.projetointegrador.carekeeper.service.detection.AccidentDetection;
import br.pucgo.ads.projetointegrador.carekeeper.service.detection.config.ConfigurationService;
import br.pucgo.ads.projetointegrador.carekeeper.service.detection.config.UserConfigurationCache;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/usuarios")
@Slf4j
public class UserConfigurationController {

    private final ConfigurationService configurationService;
    private final UserConfigurationCache userConfigurationCache;
    private final AccidentDetection accidentDetection;

    public UserConfigurationController(ConfigurationService configurationService,
                                       UserConfigurationCache userConfigurationCache,
                                       AccidentDetection accidentDetection) {
        this.configurationService = configurationService;
        this.userConfigurationCache = userConfigurationCache;
        this.accidentDetection = accidentDetection;
    }

    // ============================================================
    //  CONFIGURAÇÕES DE SENSORES
    // ============================================================

    /**
     * 🔹 Retorna a configuração atual dos sensores de um usuário.
     * Exemplo: GET /api/usuarios/{userId}/sensor-config
     */
    @GetMapping("/{userId}/sensor-config")
    public UserConfig getSensorConfig(@PathVariable Long userId) {
        return configurationService.getUserConfig(userId);
    }

    /**
     * 🔹 Atualiza a configuração completa dos sensores de um usuário.
     * Após salvar no banco, o cache e os detectores são atualizados automaticamente.
     * Exemplo: PUT /api/usuarios/{userId}/sensor-config
     */
    @PutMapping("/{userId}/sensor-config")
    public UserConfig updateSensorConfig(@PathVariable Long userId, @RequestBody UserConfig config) {
        log.info("⚙️ Atualizando configuração de sensores do usuário {}", userId);

        // Atualiza e salva a nova configuração no banco
        UserConfig updatedConfig = configurationService.updateUserConfig(userId, config);

        // Recarrega o cache e recria os detectores com base na nova configuração
        userConfigurationCache.refreshConfig(userId);
        accidentDetection.refreshUserDetectors(userId);

        log.info("✅ Configuração de sensores do usuário {} atualizada e detectores reinicializados.", userId);
        return updatedConfig;
    }

    // ============================================================
    //  ENDPOINTS DE ALERTAS (usados por alertsApi)
    // ============================================================

    /**
     * 🔹 Lista todos os usuários e seus respectivos estados de alerta.
     * Exemplo: GET /api/usuarios/alertas
     */
    @GetMapping("/alertas")
    public List<ConfigurationEntity> listarAlertas() {
        log.info("📡 Listando estados de alerta de todos os usuários");
        return configurationService.listAllAlertStates();
    }

    /**
     * 🔹 Atualiza o estado de alerta (ativo/inativo) de um usuário.
     * Exemplo: PATCH /api/usuarios/{id}/alerta
     * Body: { "alert": true }
     */
    @PatchMapping("/{id}/alerta")
    public ConfigurationEntity atualizarAlerta(
            @PathVariable Long id,
            @RequestBody Map<String, Boolean> body
    ) {
        boolean novoEstado = body.getOrDefault("alert", false);
        log.info("🚨 Atualizando estado de alerta do usuário {} para {}", id, novoEstado);

        ConfigurationEntity updated = configurationService.updateAlertStatus(id, novoEstado);

        // Atualiza detectores em caso de desativação manual
        if (!novoEstado) {
            accidentDetection.refreshUserDetectors(id);
        }

        return updated;
    }

    /**
     * 🔹 Reseta todos os estados de alerta (define todos como false).
     * Exemplo: POST /api/usuarios/alertas/resetar
     */
    @PostMapping("/alertas/resetar")
    public void resetarAlertas() {
        log.warn("⚠️ Resetando todos os estados de alerta para FALSE");
        configurationService.resetAllAlerts();
    }
}
