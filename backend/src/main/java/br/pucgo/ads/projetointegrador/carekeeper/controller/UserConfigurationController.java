package br.pucgo.ads.projetointegrador.carekeeper.controller;

import br.pucgo.ads.projetointegrador.carekeeper.config.detection.UserConfig;
import br.pucgo.ads.projetointegrador.carekeeper.service.detection.config.ConfigurationService;
import br.pucgo.ads.projetointegrador.carekeeper.service.detection.config.UserConfigurationCache;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/usuarios")
public class UserConfigurationController {

    private final ConfigurationService configurationService;
    private final UserConfigurationCache userConfigurationCache;

    public UserConfigurationController(ConfigurationService configurationService, UserConfigurationCache userConfigurationCache) {
        this.configurationService = configurationService;
        this.userConfigurationCache = userConfigurationCache;
    }

    /**
     * Obtém a configuração atual dos sensores de um usuário.
     * Exemplo: GET /api/usuarios/{userId}/sensor-config
     */
    @GetMapping("/{userId}/sensor-config")
    public UserConfig getSensorConfig(@PathVariable Long userId) {
        return configurationService.getUserConfig(userId);
    }

    /**
     * Atualiza a configuração completa dos sensores de um usuário.
     * Exemplo: PUT /api/usuarios/{userId}/sensor-config
     */
    @PutMapping("/{userId}/sensor-config")
    public UserConfig updateSensorConfig(@PathVariable Long userId, @RequestBody UserConfig config) {
        UserConfig userConfig = configurationService.updateUserConfig(userId, config);
        this.userConfigurationCache.refreshConfig(userId);
        return userConfig;
    }
}
