package br.pucgo.ads.projetointegrador.carekeeper.service.detection.config;

import br.pucgo.ads.projetointegrador.carekeeper.config.detection.UserConfig;
import br.pucgo.ads.projetointegrador.carekeeper.entity.ConfigurationEntity;
import br.pucgo.ads.projetointegrador.carekeeper.repository.ConfigurationRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;

import jakarta.persistence.EntityNotFoundException;
import java.util.List;
import java.util.Optional;

@Service
public class ConfigurationService {

    private final ConfigurationRepository configurationRepository;
    private final ObjectMapper objectMapper;

    public ConfigurationService(ConfigurationRepository configurationRepository, ObjectMapper objectMapper) {
        this.configurationRepository = configurationRepository;
        this.objectMapper = objectMapper;
    }

    /**
     * Obtém a configuração atual do usuário.
     * Se não existir, retorna uma configuração padrão.
     */
    public UserConfig getUserConfig(Long userId) {
        Optional<ConfigurationEntity> optionalConfig = configurationRepository.findByUserId(userId);

        if (optionalConfig.isEmpty()) {
            // Retorna configuração padrão (sem salvar no banco)
            return new UserConfig();
        }

        try {
            return objectMapper.readValue(optionalConfig.get().getConfigJson(), UserConfig.class);
        } catch (Exception e) {
            throw new RuntimeException("Erro ao desserializar configuração do usuário " + userId, e);
        }
    }

    /**
     * Atualiza ou cria a configuração completa do usuário.
     */
    public UserConfig updateUserConfig(Long userId, UserConfig config) {
        try {
            String json = objectMapper.writeValueAsString(config);

            ConfigurationEntity entity = configurationRepository
                    .findByUserId(userId)
                    .orElse(new ConfigurationEntity(userId, json));

            entity.setConfigJson(json);
            configurationRepository.save(entity);

            return config;
        } catch (Exception e) {
            throw new RuntimeException("Erro ao salvar configuração do usuário " + userId, e);
        }
    }

    /**
     * Verifica se o usuário já possui uma configuração salva.
     */
    public boolean userConfigExists(Long userId) {
        return configurationRepository.existsByUserId(userId);
    }

    // ============================================================
    //  MÉTODOS RELACIONADOS AO GERENCIAMENTO DE ALERTAS
    // ============================================================

    /**
     * Lista todos os usuários e seus respectivos estados de alerta.
     */
    public List<ConfigurationEntity> listAllAlertStates() {
        return configurationRepository.findAll();
    }

    /**
     * Retorna o estado de alerta de um usuário específico.
     */
    public boolean getAlertStatus(Long userId) {
        ConfigurationEntity entity = configurationRepository.findByUserId(userId)
                .orElseThrow(() -> new EntityNotFoundException("Usuário não encontrado: " + userId));
        return entity.isAlert();
    }

    /**
     * Atualiza o estado de alerta de um usuário.
     */
    public ConfigurationEntity updateAlertStatus(Long userId, boolean alert) {
        ConfigurationEntity entity = configurationRepository.findByUserId(userId)
                .orElseThrow(() -> new EntityNotFoundException("Usuário não encontrado: " + userId));

        entity.setAlert(alert);
        return configurationRepository.save(entity);
    }

    /**
     * Reseta o estado de alerta de todos os usuários para false.
     */
    public void resetAllAlerts() {
        List<ConfigurationEntity> allConfigs = configurationRepository.findAll();
        for (ConfigurationEntity config : allConfigs) {
            config.setAlert(false);
        }
        configurationRepository.saveAll(allConfigs);
    }
}
