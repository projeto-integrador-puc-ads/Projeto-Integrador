package br.pucgo.ads.projetointegrador.diario_saude.config;

import br.pucgo.ads.projetointegrador.diario_saude.entity.ExameEntity;
import br.pucgo.ads.projetointegrador.diario_saude.repository.ExameRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;
import java.util.Map;

@Configuration
public class ExamesDataInitializer {

    @Bean
    CommandLineRunner initExames(ExameRepository exameRepository) {
        return args -> {
            // Verifica se já existem dados na tabela para evitar reinserção
            if (exameRepository.count() > 0) {
                System.out.println("Exames já populados.");
                return;
            }

            ObjectMapper mapper = new ObjectMapper();

            try {
                // Lê o arquivo 'exames.json' da pasta resources
                List<Map<String, String>> listaExamesDto = mapper.readValue(
                    getClass().getResourceAsStream("/exames.json"),
                    // Usando Map<String, String> pois o JSON de exames é mais simples
                    new TypeReference<>() {} 
                );

                for (Map<String, String> dto : listaExamesDto) {
                    ExameEntity exame = new ExameEntity();
                    
                    // Mapeia o campo "nome_exame" do JSON para a entidade
                    String nomeExame = dto.get("nome_exame");
                    
                    if (nomeExame != null && !nomeExame.trim().isEmpty()) {
                        exame.setNome_exame(nomeExame);
                        exameRepository.save(exame);
                    }
                }

                System.out.println("Exames populados com sucesso!");

            } catch (Exception e) {
                System.err.println("Erro ao inicializar dados de Exames a partir do JSON: " + e.getMessage());
            }
        };
    }
}