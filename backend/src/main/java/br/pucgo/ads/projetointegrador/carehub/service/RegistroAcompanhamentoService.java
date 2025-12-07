package br.pucgo.ads.projetointegrador.carehub.service;

import br.pucgo.ads.projetointegrador.carehub.dto.registro.RegistroAcompanhamentoRequestDTO;
import br.pucgo.ads.projetointegrador.carehub.dto.registro.RegistroAcompanhamentoResponseDTO;
import br.pucgo.ads.projetointegrador.carehub.entity.Agendamento;
import br.pucgo.ads.projetointegrador.carehub.entity.RegistroAcompanhamento;
import br.pucgo.ads.projetointegrador.carehub.repository.AgendamentoRepository;
import br.pucgo.ads.projetointegrador.carehub.repository.RegistroAcompanhamentoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
public class RegistroAcompanhamentoService {

    @Autowired
    private RegistroAcompanhamentoRepository registroRepository;

    @Autowired
    private AgendamentoRepository agendamentoRepository;

    @Transactional
    public RegistroAcompanhamentoResponseDTO criarRegistro(Long cuidadorId, RegistroAcompanhamentoRequestDTO dto) {
        Long agendamentoId = Objects.requireNonNull(dto.getAgendamentoId(), "Agendamento ID cannot be null");
        
        Agendamento agendamento = agendamentoRepository.findById(agendamentoId)
            .orElseThrow(() -> new RuntimeException("Agendamento não encontrado"));

        if (!agendamento.getCuidador().getId().equals(cuidadorId)) {
            throw new RuntimeException("Cuidador não autorizado para este agendamento");
        }

        RegistroAcompanhamento registro = new RegistroAcompanhamento();
        registro.setAgendamento(agendamento);
        registro.setCuidador(agendamento.getCuidador());
        registro.setCliente(agendamento.getCliente());
        registro.setDataHoraRegistro(
                dto.getDataHoraRegistro() != null ? dto.getDataHoraRegistro() : LocalDateTime.now()
        );
        registro.setPressaoArterial(dto.getPressaoArterial());
        registro.setGlicemia(dto.getGlicemia());
        registro.setMedicamentosAdministrados(dto.getMedicamentosAdministrados());
        registro.setAlimentacao(dto.getAlimentacao());
        registro.setAtividadesRealizadas(dto.getAtividadesRealizadas());
        registro.setObservacoes(dto.getObservacoes());
        registro.setIntercorrencias(dto.getIntercorrencias());
        registro.setSinaisVitais(dto.getSinaisVitais());

        registro = registroRepository.save(registro);

        return toResponseDTO(registro);
    }

    @Transactional(readOnly = true)
    public List<RegistroAcompanhamentoResponseDTO> listarPorCliente(Long clienteId) {
        return registroRepository.findByClienteIdOrderByDataHoraRegistroDesc(clienteId)
                .stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<RegistroAcompanhamentoResponseDTO> listarPorCuidador(Long cuidadorId) {
        return registroRepository.findByCuidadorIdOrderByDataHoraRegistroDesc(cuidadorId)
                .stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<RegistroAcompanhamentoResponseDTO> listarPorAgendamento(Long agendamentoId) {
        return registroRepository.findByAgendamentoIdOrderByDataHoraRegistroDesc(agendamentoId)
                .stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public RegistroAcompanhamentoResponseDTO buscarPorId(Long id) {
        Objects.requireNonNull(id, "Registro ID cannot be null");
        
        RegistroAcompanhamento registro = registroRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Registro não encontrado"));
        return toResponseDTO(registro);
    }

    private RegistroAcompanhamentoResponseDTO toResponseDTO(RegistroAcompanhamento registro) {
        RegistroAcompanhamentoResponseDTO dto = new RegistroAcompanhamentoResponseDTO();
        dto.setId(registro.getId());
        dto.setAgendamentoId(registro.getAgendamento().getId());
        dto.setAgendamentoStatus(registro.getAgendamento().getStatus().name()); // Adiciona o status do agendamento
        dto.setCuidadorId(registro.getCuidador().getId());
        dto.setCuidadorNome(registro.getCuidador().getName());
        dto.setClienteId(registro.getCliente().getId());
        dto.setClienteNome(registro.getCliente().getName());
        dto.setDataHoraRegistro(registro.getDataHoraRegistro());
        dto.setPressaoArterial(registro.getPressaoArterial());
        dto.setGlicemia(registro.getGlicemia());
        dto.setMedicamentosAdministrados(registro.getMedicamentosAdministrados());
        dto.setAlimentacao(registro.getAlimentacao());
        dto.setAtividadesRealizadas(registro.getAtividadesRealizadas());
        dto.setObservacoes(registro.getObservacoes());
        dto.setIntercorrencias(registro.getIntercorrencias());
        dto.setSinaisVitais(registro.getSinaisVitais());
        dto.setDataCriacao(registro.getDataCriacao());
        return dto;
    }
}
