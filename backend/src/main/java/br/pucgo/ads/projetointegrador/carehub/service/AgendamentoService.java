package br.pucgo.ads.projetointegrador.carehub.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.pucgo.ads.projetointegrador.carehub.dto.agendamento.AgendamentoRequestDTO;
import br.pucgo.ads.projetointegrador.carehub.dto.agendamento.AgendamentoResponseDTO;
import br.pucgo.ads.projetointegrador.carehub.entity.Agendamento;
import br.pucgo.ads.projetointegrador.carehub.entity.Cliente;
import br.pucgo.ads.projetointegrador.carehub.entity.Cuidador;
import br.pucgo.ads.projetointegrador.carehub.repository.AgendamentoRepository;
import br.pucgo.ads.projetointegrador.carehub.repository.ClienteRepository;
import br.pucgo.ads.projetointegrador.carehub.repository.CuidadorRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AgendamentoService {

    @Autowired
    private AgendamentoRepository agendamentoRepository;

    @Autowired
    private CuidadorRepository cuidadorRepository;

    @Autowired
    private ClienteRepository clienteRepository;

    @Transactional
    public AgendamentoResponseDTO criarAgendamento(AgendamentoRequestDTO dto) {
        Cuidador cuidador = cuidadorRepository.findById(dto.getCuidadorId())
                .orElseThrow(() -> new RuntimeException("Cuidador não encontrado"));

        Cliente cliente = clienteRepository.findById(dto.getClienteId())
                .orElseThrow(() -> new RuntimeException("Cliente não encontrado"));

        Agendamento agendamento = new Agendamento();
        agendamento.setCuidador(cuidador);
        agendamento.setCliente(cliente);
        agendamento.setDataHoraInicio(dto.getDataHoraInicio());
        agendamento.setDataHoraFim(dto.getDataHoraFim());
        agendamento.setObservacoes(dto.getObservacoes());
        agendamento.setTipoAtendimento(dto.getTipoAtendimento());

        agendamento = agendamentoRepository.save(agendamento);

        return toResponseDTO(agendamento);
    }

    @Transactional
    public AgendamentoResponseDTO atualizarStatus(Long id, String status) {
        Agendamento agendamento = agendamentoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Agendamento não encontrado"));

        agendamento.setStatus(Agendamento.StatusAgendamento.valueOf(status));
        agendamento = agendamentoRepository.save(agendamento);

        return toResponseDTO(agendamento);
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
    public List<AgendamentoResponseDTO> listarPorCuidadorEPeriodo(Long cuidadorId, LocalDateTime inicio, LocalDateTime fim) {
        return agendamentoRepository.findByCuidadorAndPeriodo(cuidadorId, inicio, fim)
                .stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public void cancelarAgendamento(Long id) {
        Agendamento agendamento = agendamentoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Agendamento não encontrado"));

        agendamento.setStatus(Agendamento.StatusAgendamento.CANCELADO);
        agendamentoRepository.save(agendamento);
    }

    private AgendamentoResponseDTO toResponseDTO(Agendamento agendamento) {
        AgendamentoResponseDTO dto = new AgendamentoResponseDTO();
        dto.setId(agendamento.getId());
        dto.setCuidadorId(agendamento.getCuidador().getId());
        dto.setCuidadorNome(agendamento.getCuidador().getNome());
        dto.setClienteId(agendamento.getCliente().getId());
        dto.setClienteNome(agendamento.getCliente().getNome());
        dto.setDataHoraInicio(agendamento.getDataHoraInicio());
        dto.setDataHoraFim(agendamento.getDataHoraFim());
        dto.setStatus(agendamento.getStatus().name());
        dto.setObservacoes(agendamento.getObservacoes());
        dto.setTipoAtendimento(agendamento.getTipoAtendimento());
        dto.setDataCriacao(agendamento.getDataCriacao());
        return dto;
    }
}
