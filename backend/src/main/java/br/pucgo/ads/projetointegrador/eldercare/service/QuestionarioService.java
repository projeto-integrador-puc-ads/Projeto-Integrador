package br.pucgo.ads.projetointegrador.eldercare.service;

import br.pucgo.ads.projetointegrador.eldercare.domain.*;
import br.pucgo.ads.projetointegrador.eldercare.dto.*;
import br.pucgo.ads.projetointegrador.eldercare.exception.NotFoundException;
import br.pucgo.ads.projetointegrador.eldercare.mapper.EldercareMapper;
import br.pucgo.ads.projetointegrador.eldercare.repository.IdosoRepository;
import br.pucgo.ads.projetointegrador.eldercare.repository.PlanoExercicioRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
public class QuestionarioService {

    private final IdosoRepository idosoRepo;
    private final PlanoExercicioRepository planoRepo;
    private final ObjectMapper mapper;

    public QuestionarioService(IdosoRepository idosoRepo,
                               PlanoExercicioRepository planoRepo,
                               ObjectMapper mapper) {
        this.idosoRepo = idosoRepo;
        this.planoRepo = planoRepo;
        this.mapper = mapper;
    }

    @Transactional
    public PlanoDTO gerarPlano(EnvioQuestionarioDTO envio) {
        // 1) Carrega Idoso
        var idoso = idosoRepo.findById(envio.idosoId())
                .orElseThrow(() -> new NotFoundException("Idoso não encontrado: " + envio.idosoId()));

        // 2) Calcula score simples a partir das respostas
        int score = 0;
        if (envio.respostas() != null) {
            for (var r : envio.respostas()) {
                String p = r.pergunta() == null ? "" : r.pergunta();
                String v = r.resposta() == null ? "" : r.resposta().toLowerCase();

                if (p.equals("frequencia_atividade")) {        // "0x_semana","1-2x_semana","3x_semana"
                    if (v.contains("3")) score += 3;
                    else if (v.contains("1-2") || v.contains("2")) score += 2;
                }
                if (p.equals("mobilidade")) {                   // "baixa","media","alta"
                    if (v.contains("alta")) score += 3;
                    else if (v.contains("media")) score += 2;
                    else score += 1;
                }
                if (p.equals("dor_articular_frequente")) { if (v.contains("sim")) score -= 2; }
                if (p.equals("hipertensao")) { if (v.contains("sim")) score -= 1; }
            }
        }

        // 3) Define nível pelo score
        var nivel = (score >= 6) ? NivelTreino.ALTO
                : (score >= 3 ? NivelTreino.MEDIO : NivelTreino.BAIXO);

        // 4) Monta Plano (pai)
        var plano = new PlanoExercicio();
        plano.setIdoso(idoso);
        plano.setDataCriacao(LocalDate.now());
        plano.setNivel(nivel);
        plano.setObservacoes("Plano gerado automaticamente. Score=" + score);

        // (Opcional) guarda o questionário respondido em JSON
        if (envio.respostas() != null) {
            try {
                plano.setRespostasJson(mapper.writeValueAsString(envio.respostas()));
            } catch (JsonProcessingException e) {
                plano.setRespostasJson(null); // se der erro, apenas não salva o JSON
            }
        }

        // 5) Gera itens (filhos) e vincula ao plano
        plano.setItens(gerarItensSemanais(nivel, plano));

        // 6) Persiste (cascade ALL salva os itens)
        var salvo = planoRepo.save(plano);
        return EldercareMapper.toDTO(salvo);
    }

    private List<ItemPlano> gerarItensSemanais(NivelTreino nivel, PlanoExercicio plano) {
        var itens = new ArrayList<ItemPlano>();

        int duracaoBase = switch (nivel) {
            case BAIXO -> 20;
            case MEDIO -> 30;
            case ALTO -> 40;
        };
        var intensidade = switch (nivel) {
            case BAIXO -> Intensidade.LEVE;
            case MEDIO -> Intensidade.MODERADA;
            case ALTO -> Intensidade.INTENSA;
        };

        itens.add(item(plano, DayOfWeek.MONDAY,    "Caminhada ao ar livre",           duracaoBase, intensidade, "Aquecimento 5 min."));
        itens.add(item(plano, DayOfWeek.WEDNESDAY, "Bicicleta estacionária",          duracaoBase, intensidade, "Hidratação."));
        itens.add(item(plano, DayOfWeek.FRIDAY,    "Caminhada leve",                  duracaoBase, intensidade, "Alongamento final."));
        itens.add(item(plano, DayOfWeek.TUESDAY,   "Fortalecimento geral (peso do corpo)", 15, Intensidade.LEVE, "Execução controlada."));
        itens.add(item(plano, DayOfWeek.THURSDAY,  "Alongamento e mobilidade",        15, Intensidade.LEVE, "Respiração controlada."));
        itens.add(item(plano, DayOfWeek.SATURDAY,  "Atividade recreativa (dança/hidro)", duracaoBase, Intensidade.LEVE, "Respeitar limites."));

        return itens;
    }

    private ItemPlano item(PlanoExercicio plano, DayOfWeek dia,
                           String atividade, int duracao,
                           Intensidade intensidade, String obs) {
        var it = new ItemPlano();
        it.setPlano(plano);              // importante: seta o 'pai' para o mappedBy
        it.setDiaSemana(dia);
        it.setAtividade(atividade);
        it.setDuracaoMin(duracao);
        it.setIntensidade(intensidade);  // enum Intensidade
        it.setObservacoes(obs);
        return it;
    }
}
