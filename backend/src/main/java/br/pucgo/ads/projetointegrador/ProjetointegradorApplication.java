package br.pucgo.ads.projetointegrador;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling; // <-- IMPORTANTE

@EnableScheduling   // 🔥 ATIVA O SCHEDULER DO PROJETO
@SpringBootApplication
public class ProjetointegradorApplication {

    public static void main(String[] args) {
        SpringApplication.run(ProjetointegradorApplication.class, args);
    }

}
