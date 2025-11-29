package br.pucgo.ads.projetointegrador.carekeeper.service.detection.config;

import br.pucgo.ads.projetointegrador.carekeeper.config.detection.UserConfig;
import br.pucgo.ads.projetointegrador.carekeeper.entity.ConfigurationEntity;
import br.pucgo.ads.projetointegrador.carekeeper.repository.ConfigurationRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class UserConfigurationCache {

    private final ConfigurationRepository configurationRepository;
    private final ObjectMapper mapper;

    // Cache em memória por userId
    private final Map<Long, UserConfig> configCache = new ConcurrentHashMap<>();

    public UserConfigurationCache(ConfigurationRepository configurationRepository) {
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
    public UserConfig getConfigForUser(Long userId) {
        // Verifica cache primeiro
        return configCache.computeIfAbsent(userId, this::loadConfigFromDb);
    }

    /**
     * Carrega a configuração do banco e desserializa para UserConfig.
     * Se não existir, cria uma configuração padrão e persiste.
     */
    private UserConfig loadConfigFromDb(Long userId) {
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
    public void refreshConfig(Long userId) {
        configCache.remove(userId);
        getConfigForUser(userId); // recarrega do banco
    }
}
