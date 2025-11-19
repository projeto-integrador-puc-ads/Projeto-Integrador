package br.pucgo.ads.projetointegrador.diario_saude.config;

import br.pucgo.ads.projetointegrador.diario_saude.entity.PerguntaEntity;
import br.pucgo.ads.projetointegrador.diario_saude.repository.PerguntaRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.*;

@Configuration
public class PerguntasDataInitializer {

    @Bean
    CommandLineRunner initDatabase(PerguntaRepository perguntaRepository) {
        return args -> {
            if(perguntaRepository.count() > 0){
                System.out.println("Perguntas já populadas.");
                return;
            }

            ObjectMapper mapper = new ObjectMapper();

            List<PerguntaEntity> perguntas = new ArrayList<>();

            perguntas.add(new PerguntaEntity(
                    "1. Qual é a sua idade:",
                    toJson(Map.of("60 a 74", 0, "75 a 85", 1, ">= 85", 2), mapper)
            ));
            perguntas.add(new PerguntaEntity(
                    "2. Em geral, comparando com outras pessoas de sua idade você diria que sua saúde é:",
                    toJson(Map.of("Excelente, muito boa ou boa", 0, "Regular ou ruim", 1), mapper)
            ));
            perguntas.add(new PerguntaEntity(
                    "3. Por causa de sua saúde ou condição física, você deixou de fazer compras?",
                    toJson(Map.of("Sim", 4, "Não ou não faz compras por outros motivos que não a saúde", 0), mapper)
            ));
            perguntas.add(new PerguntaEntity(
                    "4. Por causa de sua saúde ou condição física, você deixou de controlar seu dinheiro, gastos ou pagar as contas de sua casa?",
                    toJson(Map.of("Sim", 4, "Não ou não controla o dinheiro por outros motivos que não a saúde", 0), mapper)
            ));
            perguntas.add(new PerguntaEntity(
                    "5. Por causa de sua saúde ou condição física, você deixou de realizar pequenos trabalhos domésticos, como lavar louça, arrumar a casa ou fazer limpeza leve?",
                    toJson(Map.of("Sim", 4, "Não ou não faz mais pequenos trabalhos domésticos por outros motivos que não a saúde", 0), mapper)
            ));
            perguntas.add(new PerguntaEntity(
                    "6. Por causa de sua saúde ou condição física, você deixou de tomar banho sozinho?",
                    toJson(Map.of("Sim", 6, "Não", 0), mapper)
            ));
            perguntas.add(new PerguntaEntity(
                    "7. Algum familiar ou amigo falou que você está ficando esquecido?",
                    toJson(Map.of("Sim", 1, "Não", 0), mapper)
            ));
            perguntas.add(new PerguntaEntity(
                    "8. Este esquecimento está piorando nos últimos meses?",
                    toJson(Map.of("Sim", 1, "Não", 0), mapper)
            ));
            perguntas.add(new PerguntaEntity(
                    "9. Este esquecimento está impedindo a realização de alguma atividade do cotidiano?",
                    toJson(Map.of("Sim", 2, "Não", 0), mapper)
            ));
            perguntas.add(new PerguntaEntity(
                    "10. No último mês, você ficou com desânimo, tristeza ou desesperança?",
                    toJson(Map.of("Sim", 2, "Não", 0), mapper)
            ));
            perguntas.add(new PerguntaEntity(
                    "11. No último mês, você perdeu o interesse ou prazer em atividades anteriormente prazerosas?",
                    toJson(Map.of("Sim", 2, "Não", 0), mapper)
            ));
            perguntas.add(new PerguntaEntity(
                    "12. Você é incapaz de elevar os braços acima do nível do ombro?",
                    toJson(Map.of("Sim", 1, "Não", 0), mapper)
            ));
            perguntas.add(new PerguntaEntity(
                    "13. Você é incapaz de manusear ou segurar pequenos objetos?",
                    toJson(Map.of("Sim", 1, "Não", 0), mapper)
            ));
            perguntas.add(new PerguntaEntity(
                    "14. Você tem alguma das quatro condições abaixo relacionadas?",
                    toJson(Map.of(
                            "Perda de peso não intencional de 4,5 kg ou 5% do peso corporal no último ano ou 6 kg nos últimos 6 meses ou 3kg no ultimo mês", 2,
                            "Indice de massa corporal (IMC) menor que 22kg/m²", 2,
                            "Circunferencia da panturrilha <31cm", 2,
                            "Tempo gasto no teste de velocidade da marcha (4m) > 5 segundos", 2
                    ), mapper)
            ));
            perguntas.add(new PerguntaEntity(
                    "15. Você tem dificuldade para caminhar capaz de impedir a realização de alguma atividade do cotidiano?",
                    toJson(Map.of("Sim", 2, "Não", 0), mapper)
            ));
            perguntas.add(new PerguntaEntity(
                    "16. Você teve duas ou mais quedas no último ano?",
                    toJson(Map.of("Sim", 2, "Não", 0), mapper)
            ));
            perguntas.add(new PerguntaEntity(
                    "17. Você perde urina ou fezes, sem querer, em algum momento?",
                    toJson(Map.of("Sim", 2, "Não", 0), mapper)
            ));
            perguntas.add(new PerguntaEntity(
                    "18. Você tem problemas de visão capazes de impedir a realização de alguma atividade do cotidiano? (é permitido o uso de óculos ou lentes de contato)",
                    toJson(Map.of("Sim", 2, "Não", 0), mapper)
            ));
            perguntas.add(new PerguntaEntity(
                    "19. Você tem problemas de audição capazes de impedir a realização de alguma atividade do cotidiano? (é permitido o uso de aparelhos de audição)",
                    toJson(Map.of("Sim", 2, "Não", 0), mapper)
            ));
            perguntas.add(new PerguntaEntity(
                    "20. Você tem alguma das três condições abaixo relacionadas?\n- Cinco ou mais doenças crônicas\n- Uso regular de cinco ou mais medicamentos diferentes, todo dia\n- Internação recente, nos últimos 6 meses",
                    toJson(Map.of("Sim", 4, "Não", 0), mapper)
            ));

            perguntaRepository.saveAll(perguntas);
            System.out.println("Perguntas do questionário populadas com sucesso!");
        };
    }

    private String toJson(Map<String, Integer> opcoes, ObjectMapper mapper) {
        try {
            return mapper.writeValueAsString(opcoes);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Erro ao converter opções para JSON", e);
        }
    }
}
