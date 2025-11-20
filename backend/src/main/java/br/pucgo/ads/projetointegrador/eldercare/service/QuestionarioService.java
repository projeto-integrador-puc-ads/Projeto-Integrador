package br.pucgo.ads.projetointegrador.eldercare.service;

import br.pucgo.ads.projetointegrador.eldercare.domain.Idoso;
import br.pucgo.ads.projetointegrador.eldercare.domain.ex_dia_plano;
import br.pucgo.ads.projetointegrador.eldercare.domain.ex_exercicio;
import br.pucgo.ads.projetointegrador.eldercare.domain.ex_item_plano;
import br.pucgo.ads.projetointegrador.eldercare.domain.ex_participante;
import br.pucgo.ads.projetointegrador.eldercare.domain.ex_plano;
import br.pucgo.ads.projetointegrador.eldercare.domain.ex_resposta_questionario;
import br.pucgo.ads.projetointegrador.eldercare.dto.PlanoGeradoResponse;
import br.pucgo.ads.projetointegrador.eldercare.repository.*;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.*;

@Service
@Transactional
public class QuestionarioService {

    private final IdosoRepository idosoRepository;
    private final ParticipanteRepository participanteRepository;
    private final RespostaQuestionarioRepository respostaQuestionarioRepository;
    private final PlanoRepository planoRepository;
    private final DiaPlanoRepository diaPlanoRepository;
    private final ItemPlanoRepository itemPlanoRepository;
    private final ExercicioRepository exercicioRepository;
    private final PlanoService planoService;

    public QuestionarioService(IdosoRepository idosoRepository,
                               ParticipanteRepository participanteRepository,
                               RespostaQuestionarioRepository respostaQuestionarioRepository,
                               PlanoRepository planoRepository,
                               DiaPlanoRepository diaPlanoRepository,
                               ItemPlanoRepository itemPlanoRepository,
                               ExercicioRepository exercicioRepository,
                               PlanoService planoService) {
        this.idosoRepository = idosoRepository;
        this.participanteRepository = participanteRepository;
        this.respostaQuestionarioRepository = respostaQuestionarioRepository;
        this.planoRepository = planoRepository;
        this.diaPlanoRepository = diaPlanoRepository;
        this.itemPlanoRepository = itemPlanoRepository;
        this.exercicioRepository = exercicioRepository;
        this.planoService = planoService;
    }

    // =====================================================================
    // 1) USADO PELO FRONT /questionario/gerar
    // =====================================================================
    public PlanoGeradoResponse gerarPlanoCompat(Map<String, Object> payload) {

        Long idosoId = extractLong(payload.get("idosoId"));
        if (idosoId == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "idosoId obrigatório");
        }

        Idoso idoso = idosoRepository.findById(idosoId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Idoso não encontrado"));

        // Cria ex_participante a partir do Idoso
        ex_participante participante = new ex_participante();
        participante.setNome(idoso.getNome());
        participante.setNascimento(idoso.getDataNascimento());
        if (idoso.getSexo() != null) {
            participante.setSexo(idoso.getSexo().name());
        } else {
            participante.setSexo(null);
        }
        participante = participanteRepository.save(participante);

        // Cabeçalho da resposta do questionário
        ex_resposta_questionario respQ = new ex_resposta_questionario();
        respQ.setParticipante(participante);
        respQ.setCreatedAt(OffsetDateTime.now(ZoneOffset.UTC));
        respQ = respostaQuestionarioRepository.save(respQ);

        // Mapa códigoPergunta -> resposta
        Map<String, Object> respostasMap = extrairRespostasMap(payload);

        // Pontuação global de risco (quanto MAIOR, mais risco)
        int pontuacao = calcularPontuacao(respostasMap);

        // Nível do treino (BAIXO / MEDIO / ALTO) – agora ligado ao RISCO
        String nivel = definirNivelTreino(pontuacao, respostasMap);

        // Frequência/tempo padrão
        int freqSemana = 3;
        int tempoSessaoMin = 30;

        ex_plano plano = criarPlanoSemanalBasico(participante, respQ, nivel, freqSemana, tempoSessaoMin);

        return planoService.montarPlanoGeradoResponse(plano.getId());
    }

    // =====================================================================
    // 2) USADO PELO ENDPOINT /testar/{respostaId}
    // =====================================================================
    @Transactional(readOnly = false)
    public PlanoGeradoResponse gerarPlanoPorResposta(UUID respostaId) {

        ex_resposta_questionario respQ = respostaQuestionarioRepository.findById(respostaId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Resposta de questionário não encontrada"));

        ex_participante participante = respQ.getParticipante();
        if (participante == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Resposta de questionário sem participante associado");
        }

        // Para teste direto por resposta, usa-se um nível MEDIO padrão
        String nivel = "MEDIO";
        int freqSemana = 3;
        int tempoSessaoMin = 30;

        ex_plano plano = criarPlanoSemanalBasico(participante, respQ, nivel, freqSemana, tempoSessaoMin);

        return planoService.montarPlanoGeradoResponse(plano.getId());
    }

    // =====================================================================
    // AUXILIARES DE EXTRAÇÃO
    // =====================================================================

    private Long extractLong(Object value) {
        if (value == null) return null;
        if (value instanceof Number n) return n.longValue();
        try {
            return Long.parseLong(value.toString());
        } catch (NumberFormatException e) {
            return null;
        }
    }

    @SuppressWarnings("unchecked")
    private Map<String, Object> extrairRespostasMap(Map<String, Object> payload) {
        Object raw = payload.get("respostas");
        Map<String, Object> map = new HashMap<>();

        if (raw instanceof List<?> lista) {
            for (Object o : lista) {
                if (o instanceof Map<?, ?> entry) {
                    Object cod = entry.get("pergunta");
                    Object resp = entry.get("resposta");
                    if (cod != null) {
                        map.put(cod.toString(), resp);
                    }
                }
            }
        }
        return map;
    }

    private String getStringResposta(Map<String, Object> respostas, String chave) {
        Object valor = respostas.get(chave);
        if (valor == null) return null;
        return valor.toString().trim().toLowerCase(Locale.ROOT);
    }

    private boolean temRespostaIgual(Map<String, Object> respostas, String chave, String... valores) {
        String s = getStringResposta(respostas, chave);
        if (s == null) return false;
        for (String v : valores) {
            if (s.equals(v)) return true;
        }
        return false;
    }

    // =====================================================================
    // CÁLCULO DE PONTUAÇÃO / NÍVEL (BAIXO / MEDIO / ALTO)
    // =====================================================================

    /**
     * Converte respostas textuais em valores de 0–3 e multiplica por um peso.
     * Quanto MAIOR o resultado, MAIOR o risco / problema.
     */
    private int extrairIntResposta(Map<String, Object> respostas, String chave, int pesoPergunta) {
        Object valor = respostas.get(chave);
        if (valor == null) return 0;

        if (valor instanceof Number n) {
            return n.intValue() * pesoPergunta;
        }

        String s = valor.toString().trim().toLowerCase(Locale.ROOT);
        int base;

        // Escalas genéricas
        switch (s) {
            case "nunca" -> base = 0;
            case "raramente" -> base = 1;
            case "às vezes", "as vezes", "as_vezes" -> base = 2;
            case "frequente", "sempre" -> base = 3;

            // SIM/NAO em variações
            case "sim" -> base = 1;
            case "sim_controlada", "sim_ocasional" -> base = 1;
            case "não", "nao" -> base = 0;

            default -> {
                // Alguns códigos com números dentro, ex: "1a2_semana", "2oumais"
                if (s.contains("1a2")) {
                    base = 1;
                } else if (s.contains("2oumais")) {
                    base = 2;
                } else if (s.contains("3oumais")) {
                    base = 3;
                } else {
                    try {
                        base = Integer.parseInt(s);
                    } catch (NumberFormatException e) {
                        base = 0;
                    }
                }
            }
        }

        return base * pesoPergunta;
    }

    /**
     * Interpreta "sim", "sim_controlada", "sim_ocasional" etc como verdadeiro.
     */
    private boolean respostaEhSim(Map<String, Object> respostas, String chave) {
        Object valor = respostas.get(chave);
        if (valor == null) return false;
        String s = valor.toString().trim().toLowerCase(Locale.ROOT);
        if (s.startsWith("sim")) return true; // sim, sim_controlada, sim_ocasional...
        return s.equals("s") || s.equals("true");
    }

    /**
     * Pontuação de risco global (quanto MAIOR, mais frágil / maior cuidado).
     */
    private int calcularPontuacao(Map<String, Object> respostas) {
        int score = 0;

        // condição física / dor / mobilidade / equilíbrio
        score += extrairIntResposta(respostas, "cansaco_ativ_leves", 2);
        score += extrairIntResposta(respostas, "dor_muscular_articular", 2);
        score += extrairIntResposta(respostas, "mobilidade_geral", 2);
        score += extrairIntResposta(respostas, "equilibrio_em_um_pe", 1); // pouco peso

        // prática de atividade física REDUZ o score (mais ativo = menos risco)
        score += extrairIntResposta(respostas, "freq_atividade_fisica", -1);

        // comorbidades aumentam bastante o risco
        if (respostaEhSim(respostas, "hipertensao")) score += 4;
        if (respostaEhSim(respostas, "problema_cardiaco") || respostaEhSim(respostas, "doenca_cardiaca")) score += 5;
        if (respostaEhSim(respostas, "doenca_respiratoria")) score += 3;
        if (respostaEhSim(respostas, "diabetes")) score += 2;

        // médico recomendou limitar esforço
        if (respostaEhSim(respostas, "medico_limitou_esforco")) score += 4;

        // quedas recentes
        if (temRespostaIgual(respostas, "quedas_ultimo_ano", "1oumais")) score += 2;
        if (temRespostaIgual(respostas, "quedas_ultimo_ano", "2oumais")) score += 4;

        return Math.max(score, 0);
    }

    /**
     * Traduz o RISCO (pontuação) em nível de intensidade.
     * IMPORTANTE: agora é o inverso:
     * - mais risco  => nível BAIXO
     * - risco médio => nível MEDIO
     * - pouco risco => nível ALTO
     */
    private String definirNivelTreino(int pontuacao, Map<String, Object> respostas) {

        // Marcadores fortes de alto risco
        boolean cardioImportante =
                respostaEhSim(respostas, "hipertensao") ||
                respostaEhSim(respostas, "problema_cardiaco") ||
                respostaEhSim(respostas, "doenca_cardiaca") ||
                respostaEhSim(respostas, "medico_limitou_esforco");

        boolean faltaArFrequente =
                temRespostaIgual(respostas, "falta_ar_em_esforco_leve", "frequente", "sempre");

        boolean quedasRepetidas =
                temRespostaIgual(respostas, "quedas_ultimo_ano", "2oumais");

        boolean grandeInsegurancaCaminhar =
                respostaEhSim(respostas, "inseguranca_ao_caminhar") ||
                temRespostaIgual(respostas, "consegue_levantar_sem_apoio", "nao_consegue");

        int riscoExtra = 0;
        if (cardioImportante) riscoExtra += 4;
        if (faltaArFrequente) riscoExtra += 2;
        if (quedasRepetidas) riscoExtra += 3;
        if (grandeInsegurancaCaminhar) riscoExtra += 2;

        int riscoTotal = pontuacao + riscoExtra;

        // Debug mental:
        // riscoTotal ~0–5   => bem tranquilo
        // riscoTotal ~6–11 => moderado
        // riscoTotal >=12  => alto

        if (riscoTotal >= 12) {
            // Idoso bem frágil / vários fatores de risco
            return "BAIXO";
        } else if (riscoTotal >= 6) {
            // Zona intermediária: pode treinar, mas com cautela
            return "MEDIO";
        } else {
            // Risco baixo: pode trabalhar com intensidade um pouco maior
            return "ALTO";
        }
    }

    // =====================================================================
    // CRIAÇÃO DO PLANO (USANDO SOMENTE AS TABELAS QUE JÁ EXISTEM NO DER)
    // =====================================================================

    private ex_plano criarPlanoSemanalBasico(ex_participante participante,
                                             ex_resposta_questionario respostaQuestionario,
                                             String nivel,
                                             int freqSemana,
                                             int tempoSessaoMin) {

        ex_plano plano = new ex_plano();
        plano.setParticipante(participante);
        // Se existir no entity, poderia relacionar a resposta do questionário:
        // plano.setRespostaQuestionario(respostaQuestionario);

        plano.setMes(LocalDate.now().withDayOfMonth(1));
        plano.setObjetivo("Melhorar condicionamento");
        plano.setNivel(nivel); // BAIXO / MEDIO / ALTO
        plano.setFreqSemana(freqSemana);
        plano.setTempoSessaoMin(tempoSessaoMin);

        plano = planoRepository.save(plano);

        // cria dias fixos: segunda, quarta e sexta
        ex_dia_plano seg = criarDia(plano, "SEGUNDA-FEIRA");
        ex_dia_plano qua = criarDia(plano, "QUARTA-FEIRA");
        ex_dia_plano sex = criarDia(plano, "SEXTA-FEIRA");

        List<ex_item_plano> itens = montarItensPorNivel(nivel, seg, qua, sex);
        itemPlanoRepository.saveAll(itens);

        return plano;
    }

    private ex_dia_plano criarDia(ex_plano plano, String tituloDia) {
        ex_dia_plano dia = new ex_dia_plano();
        dia.setPlano(plano);
        dia.setDataOuOrdem(tituloDia);
        return diaPlanoRepository.save(dia);
    }

    private List<ex_item_plano> montarItensPorNivel(String nivel,
                                                    ex_dia_plano seg,
                                                    ex_dia_plano qua,
                                                    ex_dia_plano sex) {

        ex_exercicio caminhadaLeve = obterOuCriarExercicio(
                "Caminhada ao ar livre",
                30
        );

        ex_exercicio dancaLeve = obterOuCriarExercicio(
                "Dança leve/ritmada",
                30
        );

        ex_exercicio mobilidadeQuadril = obterOuCriarExercicio(
                "Mobilidade de quadril/tornozelo",
                30
        );

        ex_exercicio alongamentoSuave = obterOuCriarExercicio(
                "Alongamentos suaves (sentado)",
                20
        );

        ex_exercicio fortalecimentoMMII = obterOuCriarExercicio(
                "Fortalecimento de membros inferiores (cadeira)",
                20
        );

        List<ex_item_plano> itens = new ArrayList<>();

        switch (nivel) {
            case "ALTO" -> {
                itens.add(criarItem(seg, caminhadaLeve, 1));
                itens.add(criarItem(qua, dancaLeve, 1));
                itens.add(criarItem(sex, fortalecimentoMMII, 1));
            }
            case "MEDIO" -> {
                itens.add(criarItem(seg, caminhadaLeve, 1));
                itens.add(criarItem(qua, mobilidadeQuadril, 1));
                itens.add(criarItem(sex, dancaLeve, 1));
            }
            default -> { // BAIXO
                itens.add(criarItem(seg, caminhadaLeve, 1));
                itens.add(criarItem(qua, alongamentoSuave, 1));
                itens.add(criarItem(sex, mobilidadeQuadril, 1));
            }
        }

        return itens;
    }

    /**
     * NÃO mexe em tags_json: deixa null (campo opcional do DER).
     */
    private ex_exercicio obterOuCriarExercicio(String nome, int tempoMedioMin) {
        Optional<ex_exercicio> existente = exercicioRepository.findAll()
                .stream()
                .filter(e -> e.getNome() != null && e.getNome().equalsIgnoreCase(nome))
                .findFirst();

        if (existente.isPresent()) {
            return existente.get();
        }

        ex_exercicio ex = new ex_exercicio();
        ex.setNome(nome);
        ex.setTempoMedioMin(tempoMedioMin);
        // ex.setTagsJson(...);  // deixamos null para não mexer no DER

        return exercicioRepository.save(ex);
    }

    private ex_item_plano criarItem(ex_dia_plano dia, ex_exercicio exercicio, int ordem) {
        ex_item_plano item = new ex_item_plano();
        item.setDia(dia);
        item.setExercicio(exercicio);
        item.setSeries(1);
        item.setRepeticoes(null);
        item.setDuracaoSeg(
                exercicio.getTempoMedioMin() != null
                        ? exercicio.getTempoMedioMin() * 60
                        : null
        );
        item.setOrdem(ordem);
        return item;
    }
}
