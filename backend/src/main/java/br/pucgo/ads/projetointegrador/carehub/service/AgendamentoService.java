package br.pucgo.ads.projetointegrador.carehub.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.pucgo.ads.projetointegrador.carehub.dto.agendamento.AgendamentoRequestDTO;
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
    public AgendamentoResponseDTO atualizarStatus(Long id, String status) {
        Objects.requireNonNull(id, "Agendamento ID cannot be null");
        
        Agendamento agendamento = agendamentoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Agendamento não encontrado"));

        Agendamento.StatusAgendamento novoStatus = Agendamento.StatusAgendamento.valueOf(status);
        
        // ✅ VALIDAÇÃO: Só pode iniciar atendimento se estiver no horário correto
        if (novoStatus == Agendamento.StatusAgendamento.EM_ANDAMENTO) {
            validarInicioAtendimento(agendamento);
            
            // ✅ Criar registro de acompanhamento automático
            criarRegistroAutomatico(agendamento);
        }
        
        agendamento.setStatus(novoStatus);
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
        return agendamentoRepository.findByCuidadorIdOrderByDataHoraInicioDesc(cuidadorId)
                .stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<AgendamentoResponseDTO> listarPorCliente(Long clienteId) {
        return agendamentoRepository.findByClienteIdOrderByDataHoraInicioDesc(clienteId)
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
        return dto;
    }
}
