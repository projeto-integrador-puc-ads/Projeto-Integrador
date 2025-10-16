package br.pucgo.ads.projetointegrador.remember.service;

import br.pucgo.ads.projetointegrador.plataforma.repository.UsuarioRepository;
import br.pucgo.ads.projetointegrador.remember.domain.GatilhoTipo;
import br.pucgo.ads.projetointegrador.remember.domain.StatusPergunta;
import br.pucgo.ads.projetointegrador.remember.dto.CandidatoPergunta;
import br.pucgo.ads.projetointegrador.remember.dto.Pergunta.PerguntaCognitivaResponseDTO;
import br.pucgo.ads.projetointegrador.remember.entity.Diario;
import br.pucgo.ads.projetointegrador.remember.entity.Lembranca;
import br.pucgo.ads.projetointegrador.remember.entity.PerguntaCognitiva;
import br.pucgo.ads.projetointegrador.remember.entity.PerguntaTemplate;
import br.pucgo.ads.projetointegrador.remember.repository.DiarioRepository;
import br.pucgo.ads.projetointegrador.remember.repository.LembrancaRepository;
import br.pucgo.ads.projetointegrador.remember.repository.PerguntaCognitivaRepository;

import br.pucgo.ads.projetointegrador.remember.repository.PerguntaTemplateRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PerguntaCognitivaService {

    private final PerguntaCognitivaRepository perguntaRepository;
    private final PerguntaTemplateRepository templateRepository;
    private final LembrancaRepository lembrancaRepository;
    private final DiarioRepository diarioRepository;
    private final UsuarioRepository usuarioRepository;

    /**
     * Lista todas as perguntas com status ENVIADA para um usuário específico.
     * @param identificadorUsuario O ID do usuário.
     * @return Uma lista com as perguntas pendentes.
     */
    public List<PerguntaCognitivaResponseDTO> listarPerguntasPendentesPorUsuario(Long identificadorUsuario) {
        List<PerguntaCognitiva> perguntas = perguntaRepository
                .findByIdentificadorUsuarioAndStatus(identificadorUsuario, StatusPergunta.ENVIADA.getCodigo());

        return perguntas.stream()
                .map(PerguntaCognitivaResponseDTO::new)
                .collect(Collectors.toList());
    }

    /**
     * Lógica principal do "Gerador Semanal". Este método seria chamado por uma tarefa agendada (Cron Job)
     * para analisar as memórias da última semana e gerar a melhor pergunta possível para um usuário.
     * @param identificadorUsuario O ID do usuário para quem a pergunta será gerada.
     */
    @Transactional
    public void gerarPerguntaSemanalParaUsuario(Long identificadorUsuario) {
        if (!usuarioRepository.existsById(identificadorUsuario)) {
            return;
        }

        // 1. Obter o histórico de uso dos templates para este usuário.
        Map<Long, Long> contagemDeUso = perguntaRepository.countTemplateUsageByIdentificadorUsuario(identificadorUsuario).stream()
                .collect(Collectors.toMap(
                        result -> (Long) result[0],
                        result -> (Long) result[1]
                ));

        // 2. Reunir memórias candidatas da última semana.
        LocalDateTime dataFim = LocalDateTime.now();
        LocalDateTime dataInicio = dataFim.minusDays(7);
        List<Lembranca> lembrancasCandidatas = lembrancaRepository.findAllByIdentificadorUsuarioAndDataCriacaoBetween(identificadorUsuario, dataInicio, dataFim);
        List<Diario> diariosCandidatos = diarioRepository.findAllByIdentificadorUsuarioAndDataCriacaoBetween(identificadorUsuario, dataInicio, dataFim);
        List<Object> memoriasCandidatas = new ArrayList<>();
        memoriasCandidatas.addAll(lembrancasCandidatas);
        memoriasCandidatas.addAll(diariosCandidatos);

        if (memoriasCandidatas.isEmpty()) {
            return;
        }

        // 3. Encontrar todos os candidatos possíveis, respeitando a hierarquia de gatilhos.
        List<CandidatoPergunta> candidatos = new ArrayList<>();
        List<GatilhoTipo> prioridadeGatilhos = List.of(GatilhoTipo.DATA_ESPECIAL, GatilhoTipo.SENTIMENTO, GatilhoTipo.PALAVRA_CHAVE);

        for (GatilhoTipo tipo : prioridadeGatilhos) {
            encontrarCandidatosPorTipo(candidatos, memoriasCandidatas, tipo, contagemDeUso);
            if (!candidatos.isEmpty()) {
                break;
            }
        }

        // 4. Se nenhum candidato foi encontrado, recorre aos templates genéricos.
        if (candidatos.isEmpty()) {
            encontrarCandidatosPorTipo(candidatos, memoriasCandidatas, GatilhoTipo.GENERICO, contagemDeUso);
        }

        if (candidatos.isEmpty()) {
            return;
        }

        // 5. Selecionar o melhor candidato (aquele com o menor uso).
        long menorUso = candidatos.stream().mapToLong(CandidatoPergunta::getUsoCount).min().orElse(0);
        List<CandidatoPergunta> melhoresCandidatos = candidatos.stream()
                .filter(c -> c.getUsoCount() == menorUso)
                .collect(Collectors.toList());

        Collections.shuffle(melhoresCandidatos); // Desempata aleatoriamente
        CandidatoPergunta candidatoEscolhido = melhoresCandidatos.getFirst();

        // 6. Formatar e salvar a pergunta final.
        gerarEsalvarPergunta(candidatoEscolhido);
    }

    // --- MÉTODOS AUXILIARES PRIVADOS ---

    private void encontrarCandidatosPorTipo(List<CandidatoPergunta> candidatos, List<Object> memorias, GatilhoTipo tipo, Map<Long, Long> contagemDeUso) {
        List<PerguntaTemplate> templates = templateRepository.findByAtivoTrueAndGatilhoTipo(tipo.getCodigo());
        for (Object memoria : memorias) {
            for (PerguntaTemplate template : templates) {
                if (templateSeAplica(template, memoria)) {
                    long uso = contagemDeUso.getOrDefault(template.getIdentificadorPerguntaTemplate(), 0L);
                    candidatos.add(new CandidatoPergunta(memoria, template, uso));
                }
            }
        }
    }

    private boolean templateSeAplica(PerguntaTemplate template, Object memoria) {
        GatilhoTipo tipo = GatilhoTipo.of(template.getGatilhoTipo());

        switch (tipo) {
            case DATA_ESPECIAL:
                LocalDate dataMemoria = (memoria instanceof Lembranca l) ? l.getDataAcontecimento() : ((Diario) memoria).getDataEscrita();
                return isDataEspecial(dataMemoria, template.getGatilhoValores());

            case SENTIMENTO:
            case PALAVRA_CHAVE:
                String textoParaAnalise = getTextoDaMemoriaPorCampo(memoria, template.getCampoAlvo());
                if (!StringUtils.hasText(textoParaAnalise) || !StringUtils.hasText(template.getGatilhoValores())) {
                    return false;
                }

                String[] palavrasChave = template.getGatilhoValores().split(",");
                for (String palavra : palavrasChave) {
                    if (textoParaAnalise.toLowerCase().contains(palavra.trim().toLowerCase())) {
                        return true;
                    }
                }
                return false;

            case GENERICO:
                return true;

            default:
                return false;
        }
    }

    private boolean isDataEspecial(LocalDate data, String gatilhoValores) {
        if (!StringUtils.hasText(gatilhoValores)) {
            return false;
        }
        List<String> datasEspeciais = Arrays.asList(gatilhoValores.toUpperCase().split(","));

        if (datasEspeciais.contains("NATAL") && data.getMonthValue() == 12 && data.getDayOfMonth() == 25) {
            return true;
        }
        return datasEspeciais.contains("ANO_NOVO") && data.getMonthValue() == 1 && data.getDayOfMonth() == 1;
    }

    private String getTextoDaMemoriaPorCampo(Object memoria, String campoAlvo) {
        if (!StringUtils.hasText(campoAlvo)) return "";
        StringBuilder textoCompleto = new StringBuilder();

        if (memoria instanceof Lembranca l) {
            if ("historia".equalsIgnoreCase(campoAlvo)) textoCompleto.append(l.getHistoria()).append(" ");
            if ("titulo".equalsIgnoreCase(campoAlvo)) textoCompleto.append(l.getTitulo()).append(" ");
            if ("local".equalsIgnoreCase(campoAlvo)) textoCompleto.append(l.getLocal()).append(" ");
        } else if (memoria instanceof Diario d) {
            if ("conteudo".equalsIgnoreCase(campoAlvo)) textoCompleto.append(d.getConteudo()).append(" ");
            if ("titulo".equalsIgnoreCase(campoAlvo)) textoCompleto.append(d.getTitulo()).append(" ");
        }
        return textoCompleto.toString();
    }

    private void gerarEsalvarPergunta(CandidatoPergunta candidato) {
        PerguntaTemplate template = candidato.getTemplate();
        Object memoria = candidato.getMemoria();
        String textoFinal = formatarPergunta(template, memoria);

        PerguntaCognitiva pergunta = new PerguntaCognitiva();
        pergunta.setIdentificadorTemplateOrigem(template.getIdentificadorPerguntaTemplate());
        pergunta.setTextoPergunta(textoFinal);
        pergunta.setStatus(StatusPergunta.ENVIADA.getCodigo());

        if (memoria instanceof Lembranca l) {
            pergunta.setIdentificadorUsuario(l.getIdentificadorUsuario());
            pergunta.setIdentificadorLembranca(l.getIdentificadorLembranca());
        } else if (memoria instanceof Diario d) {
            pergunta.setIdentificadorUsuario(d.getIdentificadorUsuario());
            pergunta.setIdentificadorDiario(d.getIdentificadorDiario());
        }
        perguntaRepository.save(pergunta);
    }

    private String formatarPergunta(PerguntaTemplate template, Object memoria) {
        String texto = template.getTextoTemplate();
        if (!StringUtils.hasText(template.getCampoPlaceholder())) {
            return texto;
        }

        String valorPlaceholder = "";
        String campoPlaceholder = template.getCampoPlaceholder();
        if (memoria instanceof Lembranca l) {
            if ("titulo".equalsIgnoreCase(campoPlaceholder)) valorPlaceholder = l.getTitulo();
            if ("local".equalsIgnoreCase(campoPlaceholder)) valorPlaceholder = l.getLocal();
        } else if (memoria instanceof Diario d) {
            if ("titulo".equalsIgnoreCase(campoPlaceholder)) valorPlaceholder = d.getTitulo();
        }

        return texto.replace("{" + campoPlaceholder + "}", valorPlaceholder);
    }
}
