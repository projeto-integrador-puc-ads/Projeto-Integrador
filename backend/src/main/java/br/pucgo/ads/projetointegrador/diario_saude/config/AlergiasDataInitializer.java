package br.pucgo.ads.projetointegrador.diario_saude.config;

import br.pucgo.ads.projetointegrador.diario_saude.entity.AlergiaEntity;
import br.pucgo.ads.projetointegrador.diario_saude.repository.AlergiaRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;
import java.util.Map;

@Configuration
public class AlergiasDataInitializer{

    @Bean
    CommandLineRunner initAlergias(AlergiaRepository alergiaRepository) {
        return args -> {
            if (alergiaRepository.count() > 0) {
                System.out.println("Alergias já populadas.");
                return;
            }

            ObjectMapper mapper = new ObjectMapper();

            // Lê o arquivo da pasta resources
            List<Map<String, Object>> listaAlergias = mapper.readValue(
                getClass().getResourceAsStream("/alergias.json"),
                new TypeReference<>() {}
            );

            for (Map<String, Object> dto : listaAlergias) {
                AlergiaEntity alergia = new AlergiaEntity();
                alergia.setCodigo((String) dto.get("code"));
                alergia.setNome((String) dto.get("display"));

                String categoria = null;
                List<Map<String, String>> properties = (List<Map<String, String>>) dto.get("property");
                if (properties != null) {
                    for (Map<String, String> prop : properties) {
                        if ("category".equalsIgnoreCase(prop.get("code"))) {
                            categoria = prop.get("valueCode");
                        }
                    }
                }
                alergia.setCategoria(categoria);

                alergiaRepository.save(alergia);
            }

            System.out.println("Alergias populadas com sucesso!");
        };
    }
}
