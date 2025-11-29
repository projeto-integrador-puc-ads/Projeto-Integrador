package br.pucgo.ads.projetointegrador.carekeeper.service.detection.config;

import br.pucgo.ads.projetointegrador.carekeeper.config.detection.UserConfig;
import br.pucgo.ads.projetointegrador.carekeeper.entity.ConfigurationEntity;
import br.pucgo.ads.projetointegrador.carekeeper.repository.ConfigurationRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;

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
}
