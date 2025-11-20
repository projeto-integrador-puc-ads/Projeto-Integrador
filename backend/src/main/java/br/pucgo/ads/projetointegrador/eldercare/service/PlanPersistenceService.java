package br.pucgo.ads.projetointegrador.eldercare.service;

import br.pucgo.ads.projetointegrador.eldercare.domain.*;
import br.pucgo.ads.projetointegrador.eldercare.exception.NotFoundException;
import br.pucgo.ads.projetointegrador.eldercare.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.*;

@Service
public class PlanPersistenceService {

    private final PlanoRepository planoRepo;
    private final ParticipanteRepository participanteRepo;
    private final DiaPlanoRepository diaRepo;
    private final ItemPlanoRepository itemRepo;
    private final ExercicioRepository exercicioRepo;

    public PlanPersistenceService(PlanoRepository planoRepo,
                                  ParticipanteRepository participanteRepo,
                                  DiaPlanoRepository diaRepo,
                                  ItemPlanoRepository itemRepo,
                                  ExercicioRepository exercicioRepo) {
        this.planoRepo = planoRepo;
        this.participanteRepo = participanteRepo;
        this.diaRepo = diaRepo;
        this.itemRepo = itemRepo;
        this.exercicioRepo = exercicioRepo;
    }

    /** Gera um plano básico (3 dias com um item cada) a partir do participante. */
    @Transactional
    public ex_plano gerarPlanoBasico(UUID participanteId, String objetivo, String nivel,
                                     Integer freqSemana, Integer tempoSessaoMin) {

        ex_participante participante = participanteRepo.findById(participanteId)
                .orElseThrow(() -> new NotFoundException("Participante não encontrado: " + participanteId));

        ex_resposta_questionario rq = new ex_resposta_questionario();
        rq.setParticipante(participante);

        ex_plano plano = buildHeader(participante, rq, objetivo, nivel, freqSemana, tempoSessaoMin);

        // cria dias + itens padrão
        addItem(plano, "SEGUNDA-FEIRA", "Caminhada ao ar livre", 1, null, null, 1);
        addItem(plano, "QUARTA-FEIRA", "Dança leve/ritmada",   1, null, null, 1);
        addItem(plano, "SEXTA-FEIRA",  "Mobilidade de quadril/tornozelo", 1, null, null, 1);

        return planoRepo.save(plano);
    }

    /** Gera plano VINCULANDO o response_id existente (DER oficial). */
    @Transactional
    public ex_plano gerarPlanoVinculadoAResposta(ex_resposta_questionario rq,
                                                 String objetivo, String nivel,
                                                 Integer freqSemana, Integer tempoSessaoMin) {

        ex_participante participante = rq.getParticipante();
        if (participante == null) throw new IllegalStateException("Resposta sem participante.");

        ex_plano plano = buildHeader(participante, rq, objetivo, nivel, freqSemana, tempoSessaoMin);

        // cria dias + itens padrão
        addItem(plano, "SEGUNDA-FEIRA", "Caminhada ao ar livre", 1, null, null, 1);
        addItem(plano, "QUARTA-FEIRA", "Dança leve/ritmada",   1, null, null, 1);
        addItem(plano, "SEXTA-FEIRA",  "Mobilidade de quadril/tornozelo", 1, null, null, 1);

        return planoRepo.save(plano);
    }

    /** Adiciona 1 item; cria o dia se não existir. */
    @Transactional
    public ex_plano adicionarItem(UUID planoId, String dataOuOrdem, UUID exercicioId,
                                  Integer series, Integer repeticoes, Integer duracaoSeg, Integer ordem) {

        ex_plano plano = planoRepo.findById(planoId)
                .orElseThrow(() -> new NotFoundException("Plano não encontrado: " + planoId));

        ex_dia_plano dia = ensureDia(plano, dataOuOrdem);

        ex_exercicio ex = exercicioRepo.findById(exercicioId)
                .orElseThrow(() -> new NotFoundException("Exercício não encontrado: " + exercicioId));

        ex_item_plano item = new ex_item_plano();
        item.setDia(dia);
        item.setExercicio(ex);
        item.setSeries(series);
        item.setRepeticoes(repeticoes);
        item.setDuracaoSeg(duracaoSeg);
        item.setOrdem(ordem);

        dia.getItens().add(item);
        return planoRepo.save(plano);
    }

    // ---------- helpers ----------

    private ex_plano buildHeader(ex_participante participante, ex_resposta_questionario rq,
                                 String objetivo, String nivel, Integer freqSemana, Integer tempoSessaoMin) {
        ex_plano p = new ex_plano();
        p.setParticipante(participante);
        p.setRespostaQuestionario(rq);
        p.setMes(LocalDate.now().withDayOfMonth(1));
        p.setObjetivo(objetivo);
        p.setNivel(nivel);
        p.setFreqSemana(freqSemana);
        p.setTempoSessaoMin(tempoSessaoMin);
        p.setDias(new ArrayList<>());
        return p;
    }

    private void addItem(ex_plano plano, String diaLabel, String exercicioNome,
                         Integer series, Integer repeticoes, Integer duracaoSeg, Integer ordem) {

        ex_dia_plano dia = ensureDia(plano, diaLabel);

        ex_exercicio exercicio = exercicioRepo.findByNomeIgnoreCase(exercicioNome)
                .orElseGet(() -> {
                    ex_exercicio novo = new ex_exercicio();
                    novo.setNome(exercicioNome);
                    novo.setTempoMedioMin(30);
                    // tags_json pode ficar null
                    return exercicioRepo.save(novo);
                });

        ex_item_plano item = new ex_item_plano();
        item.setDia(dia);
        item.setExercicio(exercicio);
        item.setSeries(series);
        item.setRepeticoes(repeticoes);
        item.setDuracaoSeg(duracaoSeg);
        item.setOrdem(ordem);

        dia.getItens().add(item);
    }

    private ex_dia_plano ensureDia(ex_plano plano, String diaLabel) {
        for (ex_dia_plano d : plano.getDias()) {
            if (diaLabel.equalsIgnoreCase(d.getDataOuOrdem())) {
                return d;
            }
        }
        ex_dia_plano novo = new ex_dia_plano();
        novo.setPlano(plano);
        novo.setDataOuOrdem(diaLabel);
        novo.setItens(new ArrayList<>());
        plano.getDias().add(novo);
        return novo;
    }
}
