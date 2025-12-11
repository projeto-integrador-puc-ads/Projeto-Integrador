package br.pucgo.ads.projetointegrador.remember.service;

import br.pucgo.ads.projetointegrador.plataforma.entity.User;
import br.pucgo.ads.projetointegrador.plataforma.repository.UserRepository;
import br.pucgo.ads.projetointegrador.remember.dto.conquista.ConquistaResponseDTO;
import br.pucgo.ads.projetointegrador.remember.entity.Conquista;
import br.pucgo.ads.projetointegrador.remember.entity.UsuarioConquista;
import br.pucgo.ads.projetointegrador.remember.key.UsuarioConquistaKey;
import br.pucgo.ads.projetointegrador.remember.repository.ConquistaRepository;
import br.pucgo.ads.projetointegrador.remember.repository.DiarioRepository;
import br.pucgo.ads.projetointegrador.remember.repository.LembrancaRepository;
import br.pucgo.ads.projetointegrador.remember.repository.UsuarioConquistaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class GameService {

    @Autowired
    private UsuarioConquistaRepository usuarioConquistaRepository;

    @Autowired
    private ConquistaService conquistaService;

    @Autowired
    private ConquistaRepository conquistaRepository;

    @Autowired
    private DiarioRepository diarioRepository;

    @Autowired
    private LembrancaRepository lembrancaRepository;

    @Autowired
    private UserRepository usuarioRepository;

    // Constantes para os Tipos de Conquista (conforme seu banco de dados)
    private static final int TIPO_DIARIO_QUANTIDADE = 1;
    private static final int TIPO_LEMBRANCA_QUANTIDADE = 2;
    private static final int TIPO_DIAS_CONSECUTIVOS = 3;
    private static final int TIPO_MESES_CONSECUTIVOS = 4;

    /**
     * Chamado pelo DiarioService. Verifica todas as conquistas relacionadas a Diários.
     */
    @Transactional
    public List<ConquistaResponseDTO> verificarTodasConquistasDiario(Long usuarioId) {
        List<ConquistaResponseDTO> conquistasGanhas = new ArrayList<>();

        // 1. Verifica Quantidade Total de Diários (Tipo 1)
        long qtdTotal = diarioRepository.countByIdentificadorUsuario(usuarioId);
        conquistasGanhas.addAll(verificarEConceder(usuarioId, TIPO_DIARIO_QUANTIDADE, qtdTotal));

        // 2. Calcula e Verifica Dias Consecutivos (Tipo 3)
        long streakDias = calcularStreakDias(usuarioId);
        conquistasGanhas.addAll(verificarEConceder(usuarioId, TIPO_DIAS_CONSECUTIVOS, streakDias));

        // 3. Calcula e Verifica Meses Consecutivos (Tipo 4)
        long streakMeses = calcularStreakMeses(usuarioId);
        conquistasGanhas.addAll(verificarEConceder(usuarioId, TIPO_MESES_CONSECUTIVOS, streakMeses));

        return conquistasGanhas;
    }

    /**
     * Chamado pelo LembrancaService. Verifica conquistas relacionadas a Lembranças.
     */
    @Transactional
    public List<ConquistaResponseDTO> verificarConquistasLembranca(Long usuarioId) {
        // 1. Verifica Quantidade Total de Lembranças (Tipo 2)
        long qtdLembrancas = lembrancaRepository.countByIdentificadorUsuario(usuarioId);

        return verificarEConceder(usuarioId, TIPO_LEMBRANCA_QUANTIDADE, qtdLembrancas);
    }

    /**
     * Lógica central que verifica se a meta foi batida e salva no banco.
     */
    private List<ConquistaResponseDTO> verificarEConceder(Long usuarioId, int tipo, long valorAtual) {
        List<ConquistaResponseDTO> novasConquistas = new ArrayList<>();

        // 1. Busca todas as conquistas possíveis desse tipo no banco
        List<Conquista> conquistasDoTipo = conquistaRepository.findByTipo(tipo);

        // 2. Busca os IDs das conquistas que o usuário JÁ TEM (para não repetir)
        Set<Long> idsJaAdquiridos = usuarioConquistaRepository
                .findByUsuarioConquistaKey_IdentificadorUsuarioOrderByDataObtencaoAsc(usuarioId)
                .stream()
                .map(uc -> uc.getConquista().getIdentificadorConquista())
                .collect(Collectors.toSet());

        // 3. Busca a entidade do usuário (necessária para salvar o relacionamento)
        User usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado para gamificação"));

        // 4. Itera sobre as regras
        for (Conquista c : conquistasDoTipo) {
            // Se o usuário NÃO tem a conquista E o valor atual atingiu a meta
            if (!idsJaAdquiridos.contains(c.getIdentificadorConquista()) && valorAtual >= c.getMeta()) {

                // --- CONCEDER A CONQUISTA ---
                UsuarioConquista nova = new UsuarioConquista();

                // Configura Chave Composta
                UsuarioConquistaKey key = new UsuarioConquistaKey(usuarioId, c.getIdentificadorConquista());
                nova.setUsuarioConquistaKey(key);

                // Configura Relacionamentos
                nova.setUsuario(usuario);
                nova.setConquista(c);

                // Salva no banco
                usuarioConquistaRepository.save(nova);

                // Adiciona na lista de retorno para o Frontend exibir
                novasConquistas.add(conquistaService.prepararDTO(c));
            }
        }

        return novasConquistas;
    }

    /**
     * Calcula quantos dias CONSECUTIVOS o usuário escreveu diários.
     * Ex: Escreveu hoje, ontem e anteontem = 3 dias.
     */
    private long calcularStreakDias(Long usuarioId) {
        // Busca datas distintas ordenadas da mais recente para a mais antiga
        List<LocalDate> datas = diarioRepository.findDatasEscritasPorUsuario(usuarioId);

        if (datas.isEmpty()) return 0;

        // Verifica se o último diário é de HOJE ou ONTEM.
        // Se o último diário foi anteontem, a sequência já quebrou e é 0 (ou 1 se escreveu hoje).
        // Mas para simplificar a lógica de conquista, vamos contar a sequência baseada no histórico.

        long streak = 1; // O primeiro dia da lista conta como 1

        for (int i = 0; i < datas.size() - 1; i++) {
            LocalDate diaRecente = datas.get(i);
            LocalDate diaAnterior = datas.get(i + 1);

            // Se a diferença for exatamente 1 dia, continua a sequência
            if (diaRecente.minusDays(1).equals(diaAnterior)) {
                streak++;
            } else {
                // Se tem um buraco maior que 1 dia, a sequência acabou
                break;
            }
        }
        return streak;
    }

    /**
     * Calcula quantos meses CONSECUTIVOS o usuário tem atividade.
     */
    private long calcularStreakMeses(Long usuarioId) {
        List<LocalDate> datas = diarioRepository.findDatasEscritasPorUsuario(usuarioId);

        if (datas.isEmpty()) return 0;

        // Transforma datas (2025-10-15) em Ano-Mês (2025-10) e remove duplicatas
        List<YearMonth> mesesUnicos = datas.stream()
                .map(YearMonth::from)
                .distinct()
                .toList();

        if (mesesUnicos.isEmpty()) return 0;

        long streak = 1;

        for (int i = 0; i < mesesUnicos.size() - 1; i++) {
            YearMonth mesRecente = mesesUnicos.get(i);
            YearMonth mesAnterior = mesesUnicos.get(i + 1);

            // Verifica se é o mês imediatamente anterior
            if (mesRecente.minusMonths(1).equals(mesAnterior)) {
                streak++;
            } else {
                break;
            }
        }
        return streak;
    }
}