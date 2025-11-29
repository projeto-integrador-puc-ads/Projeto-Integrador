package com.example.carekeeper.config.detection;

import com.example.carekeeper.model.ConfigurationEntity;
import com.example.carekeeper.pojo.UserConfig;
import com.example.carekeeper.repository.ConfigurationRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class UserConfigService {

    private final ConfigurationRepository configurationRepository;
    private final ObjectMapper mapper;

    // Cache em memória por userId
    private final Map<UUID, UserConfig> configCache = new ConcurrentHashMap<>();

    public UserConfigService(ConfigurationRepository configurationRepository) {
        this.configurationRepository = configurationRepository;
        this.mapper = new ObjectMapper();
    }

    /**
     * Retorna uma configuração padrão (não persistida). Útil para inicializar detectores padrão.
     */
    public UserConfig getDefaultConfig() {
        return new UserConfig();
    }

    /**
     * Retorna a configuração do usuário, usando cache para evitar múltiplas consultas ao banco.
     */
    public UserConfig getConfigForUser(UUID userId) {
        // Verifica cache primeiro
        return configCache.computeIfAbsent(userId, this::loadConfigFromDb);
    }

    /**
     * Carrega a configuração do banco e desserializa para UserConfig.
     * Se não existir, cria uma configuração padrão e persiste.
     */
    private UserConfig loadConfigFromDb(UUID userId) {
        try {
            Optional<ConfigurationEntity> entityOpt = configurationRepository.findByUserId(userId);
            if (entityOpt.isPresent()) {
                String json = entityOpt.get().getConfigJson();
                try {
                    return mapper.readValue(json, UserConfig.class);
                } catch (Exception e) {
                    return new UserConfig();
                }
            } else {
                // Cria defaults e persiste
                UserConfig defaults = new UserConfig();
                try {
                    String json = mapper.writeValueAsString(defaults);
                    ConfigurationEntity ent = new ConfigurationEntity(userId, json);
                    configurationRepository.save(ent);
                } catch (Exception ignored) { }
                return defaults;
            }
        } catch (Exception e) {
            return new UserConfig();
        }
    }

    /**
     * Atualiza manualmente a configuração de um usuário no cache (ex.: após alteração).
     */
    public void refreshConfig(UUID userId) {
        configCache.remove(userId);
        getConfigForUser(userId); // recarrega do banco
    }
}
