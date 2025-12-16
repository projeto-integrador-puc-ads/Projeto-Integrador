package br.pucgo.ads.projetointegrador.DoseCertaApp.scheduler;

import br.pucgo.ads.projetointegrador.DoseCertaApp.service.MedicamentoAtrasoService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class MedicamentoAtrasoScheduler {

    private static final Logger logger = LoggerFactory.getLogger(MedicamentoAtrasoScheduler.class);

    private final MedicamentoAtrasoService atrasoService;

    public MedicamentoAtrasoScheduler(MedicamentoAtrasoService atrasoService) {
        this.atrasoService = atrasoService;
    }

    // Executa a cada 1 segundo
    @Scheduled(fixedRate = 6000)
    public void checarAtrasos() {
        logger.info("⏱️ Scheduler executado — verificando atrasos...");
        atrasoService.verificarAtrasos();
    }
}
