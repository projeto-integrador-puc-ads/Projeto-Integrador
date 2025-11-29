package com.example.carekeeper.controller;

import com.example.carekeeper.pojo.UserConfig;
import com.example.carekeeper.service.ConfigurationService;
import org.springframework.web.bind.annotation.*;
import com.example.carekeeper.config.detection.UserConfigService;

import java.util.UUID;

@RestController
@RequestMapping("/api/usuarios")
public class UserConfigurationController {

    private final ConfigurationService configurationService;
    private final UserConfigService userConfigService;

    public UserConfigurationController(ConfigurationService configurationService, UserConfigService userConfigService) {
        this.configurationService = configurationService;
        this.userConfigService = userConfigService;
    }

    /**
     * Obtém a configuração atual dos sensores de um usuário.
     * Exemplo: GET /api/usuarios/{userId}/sensor-config
     */
    @GetMapping("/{userId}/sensor-config")
    public UserConfig getSensorConfig(@PathVariable UUID userId) {
        return configurationService.getUserConfig(userId);
    }

    /**
     * Atualiza a configuração completa dos sensores de um usuário.
     * Exemplo: PUT /api/usuarios/{userId}/sensor-config
     */
    @PutMapping("/{userId}/sensor-config")
    public UserConfig updateSensorConfig(@PathVariable UUID userId, @RequestBody UserConfig config) {
        UserConfig userConfig = configurationService.updateUserConfig(userId, config);
        this.userConfigService.refreshConfig(userId); // Atualiza o cache
        return userConfig;
    }
}
