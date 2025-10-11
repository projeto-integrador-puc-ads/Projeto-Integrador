package br.pucgo.ads.projetointegrador.carehub.config;

import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

/**
 * Configuração do módulo CareHub
 * 
 * IMPORTANTE: As entidades JPA estão mapeadas mas NÃO serão criadas automaticamente no banco.
 * Esta configuração serve apenas para demonstração da estrutura do backend.
 * 
 * Para criar as tabelas, execute o script SQL apropriado quando o gerente aprovar.
 */
@Configuration
@EnableJpaRepositories(basePackages = "br.pucgo.ads.projetointegrador.carehub.repository")
@EntityScan(basePackages = "br.pucgo.ads.projetointegrador.carehub.entity")
public class CareHubConfig {
    
    // Configuração básica do módulo CareHub
    // As entidades JPA estão prontas mas aguardam aprovação para criação no banco
}
