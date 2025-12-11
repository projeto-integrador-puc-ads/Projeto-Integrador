package br.pucgo.ads.projetointegrador.carekeeper.config.seed;

import br.pucgo.ads.projetointegrador.carekeeper.service.detection.config.ConfigurationService;
import br.pucgo.ads.projetointegrador.carekeeper.service.detection.config.UserConfigurationCache;
import br.pucgo.ads.projetointegrador.carekeeper.config.detection.UserConfig;
import br.pucgo.ads.projetointegrador.carekeeper.entity.ConfigurationEntity;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

/**
 * Popula o banco de dados com uma configuração padrão de usuário
 * ao iniciar a aplicação (apenas no profile "dev").
 */
@Order(1)
@Profile("dev")
@Component
public class DevUserConfigSeeder implements ApplicationRunner {

    private static final Logger log = LoggerFactory.getLogger(DevUserConfigSeeder.class);

    private final ConfigurationService configurationService;
    private final UserConfigurationCache userConfigurationCache;
    private final ObjectMapper mapper = new ObjectMapper();

    public DevUserConfigSeeder(ConfigurationService configurationService,
                               UserConfigurationCache userConfigurationCache) {
        this.configurationService = configurationService;
        this.userConfigurationCache = userConfigurationCache;
    }

    @Override
    public void run(ApplicationArguments args) {
        Long demoUserId = 1L;

        try {
            // Verifica se já existe configuração para o usuário
            boolean exists = configurationService.userConfigExists(demoUserId);
            if (exists) {
                log.info("Configuração já existente para o usuário {}. Nenhuma ação necessária.", demoUserId);
                return;
            }

            UserConfig defaults = userConfigurationCache.getDefaultConfig();
            String json = mapper.writeValueAsString(defaults);
            ConfigurationEntity ent = new ConfigurationEntity(demoUserId, json);

            configurationService.updateUserConfig(demoUserId, defaults);
            log.info("Configuração padrão inserida para o usuário {}.", demoUserId);

        } catch (Exception e) {
            log.error("Falha ao persistir configuração padrão do usuário", e);
        }
    }
}
