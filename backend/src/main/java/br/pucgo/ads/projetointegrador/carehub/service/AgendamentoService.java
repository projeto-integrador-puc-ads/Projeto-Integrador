package br.pucgo.ads.projetointegrador.carehub.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.pucgo.ads.projetointegrador.carehub.dto.agendamento.AgendamentoRequestDTO;
import br.pucgo.ads.projetointegrador.carehub.dto.agendamento.ContrapropostaRequestDTO;
import br.pucgo.ads.projetointegrador.carehub.dto.agendamento.AgendamentoResponseDTO;
import br.pucgo.ads.projetointegrador.carehub.entity.Agendamento;
import br.pucgo.ads.projetointegrador.carehub.entity.Cliente;
import br.pucgo.ads.projetointegrador.carehub.entity.Cuidador;
import br.pucgo.ads.projetointegrador.carehub.entity.RegistroAcompanhamento;
import br.pucgo.ads.projetointegrador.carehub.entity.TipoAtendimento;
import br.pucgo.ads.projetointegrador.carehub.exception.OperacaoNaoPermitidaException;
import br.pucgo.ads.projetointegrador.carehub.repository.AgendamentoRepository;
import br.pucgo.ads.projetointegrador.carehub.repository.ClienteRepository;
import br.pucgo.ads.projetointegrador.carehub.repository.CuidadorRepository;
import br.pucgo.ads.projetointegrador.carehub.repository.RegistroAcompanhamentoRepository;
import br.pucgo.ads.projetointegrador.plataforma.repository.UserRepository;
import br.pucgo.ads.projetointegrador.plataforma.entity.User;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
public class AgendamentoService {

    @Autowired
    private AgendamentoRepository agendamentoRepository;

    @Autowired
    private CuidadorRepository cuidadorRepository;

    @Autowired
    private ClienteRepository clienteRepository;

    @Autowired
    private RegistroAcompanhamentoRepository registroRepository;
    
    @Autowired
    private UserRepository userRepository;

    // ✅ Método helper para obter ID do usuário pelo username ou email
    public Long getUserIdByUsernameOrEmail(String usernameOrEmail) {
        User user = userRepository.findByUsernameOrEmail(usernameOrEmail, usernameOrEmail)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado: " + usernameOrEmail));
        return user.getId();
    }

    @Transactional
    public AgendamentoResponseDTO criarAgendamento(AgendamentoRequestDTO dto) {
        Long cuidadorId = Objects.requireNonNull(dto.getCuidadorId(), "Cuidador ID cannot be null");
        Long clienteId = Objects.requireNonNull(dto.getClienteId(), "Cliente ID cannot be null");
        
        Cuidador cuidador = cuidadorRepository.findById(cuidadorId)
                .orElseThrow(() -> new RuntimeException("Cuidador não encontrado"));

        Cliente cliente = clienteRepository.findById(clienteId)
                .orElseThrow(() -> new RuntimeException("Cliente não encontrado"));

        Agendamento agendamento = new Agendamento();
        agendamento.setCuidador(cuidador);
        agendamento.setCliente(cliente);
        agendamento.setDataHoraInicio(dto.getDataHoraInicio());
        agendamento.setDataHoraFim(dto.getDataHoraFim());
        agendamento.setObservacoes(dto.getObservacoes());
        
        // Converter String para Enum (se fornecido)
        if (dto.getTipoAtendimento() != null && !dto.getTipoAtendimento().isBlank()) {
            try {
                agendamento.setTipoAtendimento(TipoAtendimento.valueOf(dto.getTipoAtendimento().toUpperCase()));
            } catch (IllegalArgumentException e) {
                // Valor inválido, usar ACOMPANHAMENTO como padrão
                agendamento.setTipoAtendimento(TipoAtendimento.ACOMPANHAMENTO);
            }
        } else {
            // Padrão se não especificado
            agendamento.setTipoAtendimento(TipoAtendimento.ACOMPANHAMENTO);
        }

        agendamento = agendamentoRepository.save(agendamento);

        return toResponseDTO(agendamento);
    }

    @Transactional
    public AgendamentoResponseDTO atualizarStatus(Long id, String status, java.security.Principal principal) {
        Objects.requireNonNull(id, "Agendamento ID cannot be null");
        
        Agendamento agendamento = agendamentoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Agendamento não encontrado"));

        if (principal == null) {
            throw new OperacaoNaoPermitidaException("Operação não autorizada: usuário não autenticado");
        }

        Long callerId = getUserIdByUsernameOrEmail(principal.getName());
        Agendamento.StatusAgendamento novoStatus = Agendamento.StatusAgendamento.valueOf(status);

        // Handle transitions with authorization rules
        switch (novoStatus) {
            case EM_ANDAMENTO:
                // Somente o cuidador pode iniciar
                if (!callerId.equals(agendamento.getCuidador().getId())) {
                    throw new OperacaoNaoPermitidaException("Apenas o cuidador pode iniciar o atendimento");
                }
                validarInicioAtendimento(agendamento);
                criarRegistroAutomatico(agendamento);
                agendamento.setStatus(novoStatus);
                break;

            case CONFIRMADO:
                // Se estava REAGENDADO, o cliente pode aceitar a contraproposta
                if (agendamento.getStatus() == Agendamento.StatusAgendamento.REAGENDADO) {
                    if (!callerId.equals(agendamento.getCliente().getId())) {
                        throw new OperacaoNaoPermitidaException("Apenas o cliente pode aceitar a contraproposta");
                    }
                    // Aplica as datas propostas
                    if (agendamento.getProposedDataHoraInicio() == null || agendamento.getProposedDataHoraFim() == null) {
                        throw new RuntimeException("Não existe contraproposta pendente para este agendamento");
                    }
                    agendamento.setDataHoraInicio(agendamento.getProposedDataHoraInicio());
                    agendamento.setDataHoraFim(agendamento.getProposedDataHoraFim());
                    agendamento.setProposedDataHoraInicio(null);
                    agendamento.setProposedDataHoraFim(null);
                    agendamento.setStatus(Agendamento.StatusAgendamento.CONFIRMADO);
                } else {
                    // Se estava PENDENTE, somente o cuidador pode confirmar
                    if (!callerId.equals(agendamento.getCuidador().getId())) {
                        throw new OperacaoNaoPermitidaException("Apenas o cuidador pode confirmar a proposta inicial");
                    }
                    agendamento.setStatus(Agendamento.StatusAgendamento.CONFIRMADO);
                }
                break;

            case REAGENDADO:
                // REAGENDADO deve ser criado via endpoint de contraproposta (proporContraproposta)
                throw new OperacaoNaoPermitidaException("Use o endpoint de contraproposta para propor nova data");

            case CANCELADO:
                // Cliente ou cuidador podem cancelar
                if (!callerId.equals(agendamento.getCliente().getId()) && !callerId.equals(agendamento.getCuidador().getId())) {
                    throw new OperacaoNaoPermitidaException("Somente o cliente ou o cuidador podem cancelar este agendamento");
                }
                agendamento.setStatus(Agendamento.StatusAgendamento.CANCELADO);
                break;

            case CONCLUIDO:
                // Apenas cuidador pode marcar concluído
                if (!callerId.equals(agendamento.getCuidador().getId())) {
                    throw new OperacaoNaoPermitidaException("Apenas o cuidador pode marcar como concluído");
                }
                agendamento.setStatus(Agendamento.StatusAgendamento.CONCLUIDO);
                break;

            case PENDENTE:
            default:
                throw new OperacaoNaoPermitidaException("Transição de status não permitida");
        }

        agendamento = agendamentoRepository.save(agendamento);
        return toResponseDTO(agendamento);
    }

    @Transactional
    public AgendamentoResponseDTO proporContraproposta(Long id, ContrapropostaRequestDTO dto, java.security.Principal principal) {
        Objects.requireNonNull(id, "Agendamento ID cannot be null");
        Agendamento agendamento = agendamentoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Agendamento não encontrado"));

        if (principal == null) {
            throw new OperacaoNaoPermitidaException("Operação não autorizada: usuário não autenticado");
        }

        Long callerId = getUserIdByUsernameOrEmail(principal.getName());

        // Somente o cuidador pode propor contraproposta
        if (!callerId.equals(agendamento.getCuidador().getId())) {
            throw new OperacaoNaoPermitidaException("Apenas o cuidador pode propor uma contraproposta");
        }

        if (dto.getDataHoraFim().isBefore(dto.getDataHoraInicio())) {
            throw new RuntimeException("Data/hora de fim da contraproposta deve ser posterior ao início");
        }

        if (dto.getDataHoraInicio().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("A contraproposta não pode ter início no passado");
        }

        agendamento.setProposedDataHoraInicio(dto.getDataHoraInicio());
        agendamento.setProposedDataHoraFim(dto.getDataHoraFim());
        agendamento.setStatus(Agendamento.StatusAgendamento.REAGENDADO);

        agendamento = agendamentoRepository.save(agendamento);
        return toResponseDTO(agendamento);
    }

    @Transactional
    public AgendamentoResponseDTO aceitarContraproposta(Long id, java.security.Principal principal) {
        Objects.requireNonNull(id, "Agendamento ID cannot be null");
        Agendamento agendamento = agendamentoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Agendamento não encontrado"));

        if (principal == null) {
            throw new OperacaoNaoPermitidaException("Operação não autorizada: usuário não autenticado");
        }

        Long callerId = getUserIdByUsernameOrEmail(principal.getName());

        // Somente o cliente pode aceitar contraproposta
        if (!callerId.equals(agendamento.getCliente().getId())) {
            throw new OperacaoNaoPermitidaException("Apenas o cliente pode aceitar a contraproposta");
        }

        if (agendamento.getStatus() != Agendamento.StatusAgendamento.REAGENDADO) {
            throw new RuntimeException("Não há contraproposta pendente para este agendamento");
        }

        if (agendamento.getProposedDataHoraInicio() == null || agendamento.getProposedDataHoraFim() == null) {
            throw new RuntimeException("Dados da contraproposta inválidos");
        }

        // Aplicar a nova data
        agendamento.setDataHoraInicio(agendamento.getProposedDataHoraInicio());
        agendamento.setDataHoraFim(agendamento.getProposedDataHoraFim());
        agendamento.setProposedDataHoraInicio(null);
        agendamento.setProposedDataHoraFim(null);
        agendamento.setStatus(Agendamento.StatusAgendamento.CONFIRMADO);

        agendamento = agendamentoRepository.save(agendamento);
        return toResponseDTO(agendamento);
    }
    
    /**
     * Valida se o atendimento pode ser iniciado baseado na data/hora atual.
     * Permite iniciar 30 minutos antes do horário agendado até o horário de fim.
     */
    private void validarInicioAtendimento(Agendamento agendamento) {
        LocalDateTime agora = LocalDateTime.now();
        LocalDateTime inicioPermitido = agendamento.getDataHoraInicio().minusMinutes(30);
        LocalDateTime fimPermitido = agendamento.getDataHoraFim();
        
        if (agora.isBefore(inicioPermitido)) {
            throw new OperacaoNaoPermitidaException(
                String.format("Não é possível iniciar o atendimento ainda. " +
                    "O atendimento está agendado para %s. " +
                    "Você poderá iniciá-lo a partir de %s (30 minutos antes).",
                    agendamento.getDataHoraInicio(),
                    inicioPermitido)
            );
        }
        
        if (agora.isAfter(fimPermitido)) {
            throw new OperacaoNaoPermitidaException(
                String.format("Não é possível iniciar o atendimento. " +
                    "O horário agendado já passou (término: %s).",
                    fimPermitido)
            );
        }
    }
    
    /**
     * Cria um registro de acompanhamento vazio quando o atendimento é iniciado.
     */
    private void criarRegistroAutomatico(Agendamento agendamento) {
        // Verifica se já existe registro para este agendamento
        boolean jaExiste = registroRepository.existsByAgendamentoId(agendamento.getId());
        
        if (!jaExiste) {
            RegistroAcompanhamento registro = new RegistroAcompanhamento();
            registro.setAgendamento(agendamento);
            registro.setCuidador(agendamento.getCuidador());
            registro.setCliente(agendamento.getCliente());
            registro.setDataHoraRegistro(LocalDateTime.now());
            registro.setObservacoes("Atendimento iniciado - Aguardando preenchimento pelo cuidador");
            
            registroRepository.save(registro);
        }
    }

    @Transactional(readOnly = true)
    public List<AgendamentoResponseDTO> listarPorCuidador(Long cuidadorId) {
        return agendamentoRepository.findByCuidadorIdOrderByDataSolicitacaoDesc(cuidadorId)
                .stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<AgendamentoResponseDTO> listarPorCliente(Long clienteId) {
        return agendamentoRepository.findByClienteIdOrderByDataSolicitacaoDesc(clienteId)
                .stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public AgendamentoResponseDTO buscarPorId(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("ID do agendamento não pode ser nulo");
        }
        Agendamento agendamento = agendamentoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Agendamento não encontrado"));
        return toResponseDTO(agendamento);
    }

    @Transactional(readOnly = true)
    public List<AgendamentoResponseDTO> listarPorCuidadorEPeriodo(Long cuidadorId, LocalDateTime inicio, LocalDateTime fim) {
        return agendamentoRepository.findByCuidadorAndPeriodo(cuidadorId, inicio, fim)
                .stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<AgendamentoResponseDTO> listarProximos(Long userId, int dias) {
        LocalDateTime agora = LocalDateTime.now();
        LocalDateTime limite = agora.plusDays(dias);
        
        // Busca agendamentos futuros tanto como cliente quanto como cuidador
        List<Agendamento> agendamentos = agendamentoRepository
                .findProximosAgendamentos(userId, agora, limite);
        
        return agendamentos.stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public void cancelarAgendamento(Long id) {
        Objects.requireNonNull(id, "Agendamento ID cannot be null");
        
        Agendamento agendamento = agendamentoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Agendamento não encontrado"));

        agendamento.setStatus(Agendamento.StatusAgendamento.CANCELADO);
        agendamentoRepository.save(agendamento);
    }

    @Transactional(readOnly = true)
    public boolean podeEditarProntuario(Long cuidadorId, Long clienteId) {
        Objects.requireNonNull(cuidadorId, "Cuidador ID cannot be null");
        Objects.requireNonNull(clienteId, "Cliente ID cannot be null");
        
        LocalDateTime inicioHoje = LocalDateTime.now().toLocalDate().atStartOfDay();
        LocalDateTime fimHoje = inicioHoje.plusDays(1);
        
        return agendamentoRepository.existsAgendamentoAtivoHoje(
            cuidadorId, 
            clienteId, 
            inicioHoje, 
            fimHoje
        );
    }
    
    /**
     * Verifica se um agendamento pode ser iniciado (mudança para status EM_ANDAMENTO).
     * Retorna informações sobre a possibilidade e motivo se não puder.
     */
    @Transactional(readOnly = true)
    public Map<String, Object> verificarPodeIniciar(Long id) {
        Objects.requireNonNull(id, "Agendamento ID cannot be null");
        
        Map<String, Object> resultado = new HashMap<>();
        
        Agendamento agendamento = agendamentoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Agendamento não encontrado"));
        
        LocalDateTime agora = LocalDateTime.now();
        LocalDateTime inicioPermitido = agendamento.getDataHoraInicio().minusMinutes(30);
        LocalDateTime fimPermitido = agendamento.getDataHoraFim();
        
        boolean podeIniciar = !agora.isBefore(inicioPermitido) && !agora.isAfter(fimPermitido);
        
        resultado.put("podeIniciar", podeIniciar);
        resultado.put("agora", agora.toString());
        resultado.put("inicioPermitido", inicioPermitido.toString());
        resultado.put("fimPermitido", fimPermitido.toString());
        resultado.put("dataHoraInicio", agendamento.getDataHoraInicio().toString());
        
        if (!podeIniciar) {
            if (agora.isBefore(inicioPermitido)) {
                resultado.put("motivo", "Ainda não está no horário. Você poderá iniciar 30 minutos antes.");
            } else {
                resultado.put("motivo", "O horário agendado já passou.");
            }
        } else {
            resultado.put("motivo", "Você pode iniciar o atendimento agora.");
        }
        
        return resultado;
    }

    private AgendamentoResponseDTO toResponseDTO(Agendamento agendamento) {
        AgendamentoResponseDTO dto = new AgendamentoResponseDTO();
        dto.setId(agendamento.getId());
        dto.setCuidadorId(agendamento.getCuidador().getId());
        dto.setCuidadorNome(agendamento.getCuidador().getName());
        dto.setClienteId(agendamento.getCliente().getId());
        dto.setClienteNome(agendamento.getCliente().getName());
        dto.setDataHoraInicio(agendamento.getDataHoraInicio());
        dto.setDataHoraFim(agendamento.getDataHoraFim());
        dto.setStatus(agendamento.getStatus().name());
        dto.setObservacoes(agendamento.getObservacoes());
        
        // Converter Enum para String (nome + descrição)
        if (agendamento.getTipoAtendimento() != null) {
            dto.setTipoAtendimento(agendamento.getTipoAtendimento().name());
        }
        
        dto.setDataSolicitacao(agendamento.getDataSolicitacao());
        dto.setProposedDataHoraInicio(agendamento.getProposedDataHoraInicio());
        dto.setProposedDataHoraFim(agendamento.getProposedDataHoraFim());
        return dto;
    }

    /**
     * Retorna agendamentos concluídos do cliente que ainda não foram avaliados.
     * Usado para o sistema de avaliação estilo Uber/99.
     */
    public List<AgendamentoResponseDTO> listarAvaliacoesPendentes(Long clienteId) {
        Objects.requireNonNull(clienteId, "Cliente ID não pode ser null");
        
        List<Agendamento> pendentes = agendamentoRepository
                .findAgendamentosPendentesAvaliacaoByClienteId(clienteId);
        
        return pendentes.stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    /**
     * Conta quantos atendimentos concluídos estão pendentes de avaliação.
     * Usado para exibir badge de notificação.
     */
    public long contarAvaliacoesPendentes(Long clienteId) {
        Objects.requireNonNull(clienteId, "Cliente ID não pode ser null");
        return agendamentoRepository.countAvaliacoesPendentesByClienteId(clienteId);
    }

    /**
     * Conta agendamentos PENDENTES aguardando confirmação do cuidador.
     * Usado para exibir badge de notificação no grid de módulos.
     */
    public long contarPendentesCuidador(Long cuidadorId) {
        Objects.requireNonNull(cuidadorId, "Cuidador ID não pode ser null");
        return agendamentoRepository.countPendentesByCuidadorId(cuidadorId);
    }

    /**
     * Conta agendamentos REAGENDADOS (contrapropostas) aguardando resposta do cliente.
     * Usado para exibir badge de notificação no grid de módulos.
     */
    public long contarReagendadosCliente(Long clienteId) {
        Objects.requireNonNull(clienteId, "Cliente ID não pode ser null");
        return agendamentoRepository.countReagendadosByClienteId(clienteId);
    }
}
