package br.pucgo.ads.projetointegrador.eldercare.service;

import br.pucgo.ads.projetointegrador.eldercare.dto.GerarPlanoRequest;
import br.pucgo.ads.projetointegrador.eldercare.dto.RespostaDTO;
import br.pucgo.ads.projetointegrador.eldercare.dto.PlanoDTO;
import br.pucgo.ads.projetointegrador.eldercare.domain.Idoso;
import br.pucgo.ads.projetointegrador.eldercare.domain.PlanoExercicio;
import br.pucgo.ads.projetointegrador.eldercare.domain.ItemPlano;
import br.pucgo.ads.projetointegrador.eldercare.domain.NivelTreino;
import br.pucgo.ads.projetointegrador.eldercare.domain.Intensidade;
import br.pucgo.ads.projetointegrador.eldercare.mapper.EldercareMapper;
import br.pucgo.ads.projetointegrador.eldercare.repository.IdosoRepository;
import br.pucgo.ads.projetointegrador.eldercare.repository.PlanoExercicioRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class PlanoService {

    private final IdosoRepository idosoRepository;
    private final PlanoExercicioRepository planoRepository;
    private final ObjectMapper objectMapper;

    public PlanoService(IdosoRepository idosoRepository,
                        PlanoExercicioRepository planoRepository,
                        ObjectMapper objectMapper) {
        this.idosoRepository = idosoRepository;
        this.planoRepository = planoRepository;
        this.objectMapper = objectMapper;
    }

    /* ===================== ENDPOINTS usados no Controller ===================== */

    public PlanoDTO buscar(Long id) {
        PlanoExercicio plano = planoRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Plano não encontrado: " + id));
        return EldercareMapper.toDTO(plano);
    }

    public List<PlanoDTO> listarPorIdoso(Long idosoId) {
        List<PlanoExercicio> planos = planoRepository.findByIdosoIdOrderByDataCriacaoDesc(idosoId);
        return planos.stream().map(EldercareMapper::toDTO).collect(Collectors.toList());
    }

    /* ========================= Gerar plano a partir do questionário ========================= */

    @Transactional
    public PlanoExercicio gerarPlano(GerarPlanoRequest req) {
        Idoso idoso = idosoRepository.findById(req.idosoId())
                .orElseThrow(() -> new NoSuchElementException("Idoso não encontrado"));

        Map<String, String> ans = toAnswerMap(req.respostas());
        validarOpcoes(ans);

        int score = pontuar(ans);
        NivelTreino nivel = classificar(score);

        PlanoExercicio plano = new PlanoExercicio();
        plano.setIdoso(idoso);
        plano.setDataCriacao(LocalDate.now());
        plano.setNivel(nivel);
        plano.setObservacoes("Plano gerado automaticamente. Score=" + score);

        try {
            plano.setRespostasJson(objectMapper.writeValueAsString(req.respostas()));
        } catch (JsonProcessingException e) {
            plano.setRespostasJson(null);
        }

        List<ItemPlano> itens = montarItensPersonalizados(nivel, ans, plano);
        plano.setItens(itens);

        return planoRepository.save(plano);
    }

    /* ==================================== Auxiliares ==================================== */

    private Map<String, String> toAnswerMap(List<RespostaDTO> respostas) {
        Map<String, String> map = new HashMap<>();
        if (respostas != null) {
            for (RespostaDTO r : respostas) {
                if (r == null) continue;
                String k = r.pergunta() == null ? "" : r.pergunta().trim().toLowerCase();
                String v = r.resposta() == null ? "" : r.resposta().trim().toLowerCase();
                if (!k.isEmpty()) map.put(k, v);
            }
        }
        return map;
    }

    /* -------------------- Validação de opções -------------------- */

    private static final Map<String, Set<String>> OPCOES = new LinkedHashMap<>();
    static {
        put("cansaco_ativ_leves", "nunca","as_vezes","frequente");
        put("adl_sem_ajuda", "sim","as_vezes","nao");
        put("atividade_freq_semana", "nunca","1x","2x","3x","4x_ou_mais");
        put("dores_articulares", "nao","as_vezes","frequente");
        put("mobilidade_nivel", "baixo","medio","alto");

        put("hipertensao", "nao","sim_controlada","sim_nao_controlada");
        put("problema_cardiaco", "nao","sim");
        put("falta_ar_esforco_leve", "nunca","as_vezes","frequente");
        put("medicacao_coracao_pressao", "nao","sim");
        put("recomendacao_limitar_esforco", "nao","sim");

        put("inseguranca_caminhar", "nao","as_vezes","sim");
        put("quedas_ultimo_ano", "nenhuma","1","2oumais");
        put("levantar_sem_apoio", "sim","dificuldade","nao_consegue");
        put("equilibrio_unipodal", "10oumais","5a9","menos5");
        put("dores_membros_tronco", "nao","as_vezes","frequente");

        put("tocar_pes_sem_dobrar", "sim","com_dificuldade","nao");
        put("rigidez_ao_acordar", "nao","as_vezes","frequente");
        put("alonga_regularmente", "sim","as_vezes","nao");
        put("dificuldade_coordenacao", "nao","leve","moderada","grave");
        put("quer_melhorar_flexibilidade", "sim","nao");

        put("fuma", "nao","sim_ocasional","sim_diario");
        put("alcool_frequencia", "nao","1a2_semana","3oumais_semana","diario");
        put("alimentacao_avaliacao", "boa","regular","ruim");
        put("dorme_bem", "sim","as_vezes","nao");
        put("ativ_ao_ar_livre", "nunca","1x_semana","2a3_semana","4oumais_semana");

        put("solidao_desmotivacao", "nunca","as_vezes","frequente");
        put("participa_grupos_sociais", "nunca","mensal","semanal");
        put("estresse_ansiedade", "nunca","as_vezes","frequente");
        put("diag_depressao", "nao","sim");
        put("prazer_exercicio", "sim","as_vezes","nao");

        put("objetivo_principal", "mobilidade","forca","equilibrio","relaxar","emagrecer");
        put("preferencia_social", "individual","grupo","indiferente");
        put("intensidade_preferida", "leve","moderada");
        put("gosta_musica", "sim","nao");
        put("local_preferido", "casa","academia","parque");

        put("dias_por_semana", "1","2","3","4oumais");
        put("tempo_por_dia", "15","20","30","45","60");
        put("horario_preferido", "manha","tarde","noite");
        put("equipamentos", "nenhum","halteres","elastico","halteres_e_elastico","outros");
        put("acomp_medico_ou_fisio", "nao","sim");
    }
    private static void put(String key, String... values) {
        OPCOES.put(key, new LinkedHashSet<>(List.of(values)));
    }

    private void validarOpcoes(Map<String, String> ans) {
        for (var entry : ans.entrySet()) {
            String k = entry.getKey();
            String v = entry.getValue();
            Set<String> permitidas = OPCOES.get(k);
            if (permitidas == null) continue; // extra -> ignora
            if (!permitidas.contains(v)) {
                throw new IllegalArgumentException(
                        "Valor inválido para '" + k + "': '" + v + "'. Aceitos: " + permitidas);
            }
        }
    }

    /* ---------------------- Pontuação (40) ---------------------- */

    private int pontuar(Map<String, String> a) {
        int s = 0;
        // 1) Condição física geral
        s += pts(a, "cansaco_ativ_leves", Map.of("nunca",2, "as_vezes",1, "frequente",-1));
        s += pts(a, "adl_sem_ajuda", Map.of("sim",2, "as_vezes",1, "nao",-2));
        s += pts(a, "atividade_freq_semana", Map.of("nunca",0, "1x",1, "2x",2, "3x",3, "4x_ou_mais",4));
        s += pts(a, "dores_articulares", Map.of("nao",2, "as_vezes",0, "frequente",-2));
        s += pts(a, "mobilidade_nivel", Map.of("baixo",0, "medio",1, "alto",2));
        // 2) Cardio/resp
        s += pts(a, "hipertensao", Map.of("nao",2, "sim_controlada",0, "sim_nao_controlada",-3));
        s += pts(a, "problema_cardiaco", Map.of("nao",2, "sim",-3));
        s += pts(a, "falta_ar_esforco_leve", Map.of("nunca",2, "as_vezes",0, "frequente",-3));
        s += pts(a, "medicacao_coracao_pressao", Map.of("nao",1, "sim",0));
        s += pts(a, "recomendacao_limitar_esforco", Map.of("nao",2, "sim",-3));
        // 3) Força/equilíbrio/postura
        s += pts(a, "inseguranca_caminhar", Map.of("nao",2, "as_vezes",0, "sim",-2));
        s += pts(a, "quedas_ultimo_ano", Map.of("nenhuma",2, "1",0, "2oumais",-3));
        s += pts(a, "levantar_sem_apoio", Map.of("sim",2, "dificuldade",0, "nao_consegue",-3));
        s += pts(a, "equilibrio_unipodal", Map.of("10oumais",2, "5a9",1, "menos5",-2));
        s += pts(a, "dores_membros_tronco", Map.of("nao",2, "as_vezes",0, "frequente",-2));
        // 4) Flexibilidade/coordenação
        s += pts(a, "tocar_pes_sem_dobrar", Map.of("sim",2, "com_dificuldade",1, "nao",0));
        s += pts(a, "rigidez_ao_acordar", Map.of("nao",2, "as_vezes",0, "frequente",-2));
        s += pts(a, "alonga_regularmente", Map.of("sim",2, "as_vezes",1, "nao",0));
        s += pts(a, "dificuldade_coordenacao", Map.of("nao",2, "leve",1, "moderada",-1, "grave",-3));
        s += pts(a, "quer_melhorar_flexibilidade", Map.of("sim",1, "nao",0));
        // 5) Hábitos/estilo de vida
        s += pts(a, "fuma", Map.of("nao",2, "sim_ocasional",0, "sim_diario",-3));
        s += pts(a, "alcool_frequencia", Map.of("nao",2, "1a2_semana",1, "3oumais_semana",0, "diario",-2));
        s += pts(a, "alimentacao_avaliacao", Map.of("boa",2, "regular",1, "ruim",-1));
        s += pts(a, "dorme_bem", Map.of("sim",2, "as_vezes",0, "nao",-2));
        s += pts(a, "ativ_ao_ar_livre", Map.of("nunca",0, "1x_semana",1, "2a3_semana",2, "4oumais_semana",3));
        // 6) Mental/social
        s += pts(a, "solidao_desmotivacao", Map.of("nunca",2, "as_vezes",0, "frequente",-2));
        s += pts(a, "participa_grupos_sociais", Map.of("nunca",0, "mensal",1, "semanal",2));
        s += pts(a, "estresse_ansiedade", Map.of("nunca",2, "as_vezes",0, "frequente",-2));
        s += pts(a, "diag_depressao", Map.of("nao",2, "sim",-2));
        s += pts(a, "prazer_exercicio", Map.of("sim",2, "as_vezes",1, "nao",0));
        // 7) Preferências (pontos leves)
        s += pts(a, "objetivo_principal", Map.of("mobilidade",1,"forca",1,"equilibrio",1,"relaxar",1,"emagrecer",1));
        s += pts(a, "preferencia_social", Map.of("individual",1,"grupo",1,"indiferente",1));
        s += pts(a, "intensidade_preferida", Map.of("leve",1,"moderada",2));
        s += pts(a, "gosta_musica", Map.of("sim",1,"nao",0));
        s += pts(a, "local_preferido", Map.of("casa",1,"academia",1,"parque",1));
        // 8) Disponibilidade
        s += pts(a, "dias_por_semana", Map.of("1",0,"2",1,"3",2,"4oumais",3));
        s += pts(a, "tempo_por_dia", Map.of("15",0,"20",1,"30",2,"45",3,"60",4));
        s += pts(a, "horario_preferido", Map.of("manha",1,"tarde",1,"noite",1));
        s += pts(a, "equipamentos", Map.of("nenhum",0,"halteres",1,"elastico",1,"halteres_e_elastico",2,"outros",1));
        s += pts(a, "acomp_medico_ou_fisio", Map.of("nao",1,"sim",0));
        return s;
    }

    private int pts(Map<String, String> a, String key, Map<String, Integer> tabela) {
        String v = a.get(key);
        if (v == null) return 0;
        return tabela.getOrDefault(v, 0);
    }

    private NivelTreino classificar(int score) {
        if (score <= 18) return NivelTreino.BAIXO;
        if (score <= 36) return NivelTreino.MEDIO;
        return NivelTreino.ALTO;
    }

    /* ---------------- Montagem de itens do plano ---------------- */

    private List<ItemPlano> montarItensPersonalizados(NivelTreino nivel, Map<String, String> a, PlanoExercicio plano) {
        int duracao = parseInt(a.get("tempo_por_dia"), 30);

        String prefInt = a.getOrDefault("intensidade_preferida","moderada");
        Intensidade intensidade = switch (nivel) {
            case BAIXO -> Intensidade.LEVE;
            case MEDIO -> "leve".equals(prefInt) ? Intensidade.LEVE : Intensidade.MODERADA;
            case ALTO  -> Intensidade.INTENSA;
        };

        String objetivo = a.getOrDefault("objetivo_principal","mobilidade");
        String local = a.getOrDefault("local_preferido","casa");
        boolean musica = "sim".equals(a.get("gosta_musica"));

        String A1, A2, A3;
        switch (objetivo) {
            case "forca" -> { A1 = "Fortalecimento (membros inferiores)"; A2 = "Fortalecimento (membros superiores)"; A3 = "Core/estabilidade"; }
            case "equilibrio" -> { A1 = "Exercícios de equilíbrio"; A2 = "Caminhada com mudança de direção"; A3 = "Subida/descida controlada"; }
            case "relaxar" -> { A1 = "Alongamento e respiração"; A2 = "Mobilidade articular suave"; A3 = "Relaxamento guiado"; }
            case "emagrecer" -> { A1 = "Caminhada ritmada"; A2 = "Bicicleta estacionária"; A3 = "Circuito leve contínuo"; }
            default -> { A1 = "Caminhada ao ar livre"; A2 = "Alongamentos dinâmicos"; A3 = "Mobilidade de quadril/tornozelo"; }
        }

        if (musica && (objetivo.equals("relaxar") || objetivo.equals("mobilidade"))) {
            A2 = "Dança leve/ritmada";
        }

        String obsBase = switch (local) {
            case "academia" -> "Use aparelhos leves e ajuste cargas com segurança.";
            case "parque"   -> "Hidrate-se e use calçado confortável.";
            default         -> "Use cadeira/parede como apoio quando necessário.";
        };

        List<ItemPlano> itens = new ArrayList<>();
        itens.add(novoItem(plano, DayOfWeek.MONDAY,    A1, duracao, intensidade, "Aquecimento 5 min. " + obsBase));
        itens.add(novoItem(plano, DayOfWeek.WEDNESDAY, A2, duracao, intensidade, "Hidratação. " + obsBase));
        itens.add(novoItem(plano, DayOfWeek.FRIDAY,    A3, duracao, intensidade, "Alongamento final. " + obsBase));
        return itens;
    }

    private ItemPlano novoItem(PlanoExercicio plano,
                               DayOfWeek dia,
                               String atividade,
                               int duracao,
                               Intensidade intensidade,
                               String obs) {
        ItemPlano it = new ItemPlano();
        it.setPlano(plano);
        it.setDiaSemana(dia);
        it.setAtividade(atividade);
        it.setDuracaoMin(duracao);
        it.setIntensidade(intensidade);
        it.setObservacoes(obs);
        return it;
    }

    private int parseInt(String n, int def) {
        try { return Integer.parseInt(n); } catch (Exception e) { return def; }
    }
}
