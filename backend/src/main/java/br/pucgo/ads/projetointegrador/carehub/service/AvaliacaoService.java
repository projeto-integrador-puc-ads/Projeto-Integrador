package br.pucgo.ads.projetointegrador.carehub.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.pucgo.ads.projetointegrador.carehub.dto.avaliacao.AvaliacaoRequestDTO;
import br.pucgo.ads.projetointegrador.carehub.dto.avaliacao.AvaliacaoResponseDTO;
import br.pucgo.ads.projetointegrador.carehub.entity.Avaliacao;
import br.pucgo.ads.projetointegrador.carehub.entity.Cuidador;
import br.pucgo.ads.projetointegrador.carehub.repository.AvaliacaoRepository;
import br.pucgo.ads.projetointegrador.carehub.repository.CuidadorRepository;
import br.pucgo.ads.projetointegrador.carehub.repository.AgendamentoRepository;
import br.pucgo.ads.projetointegrador.carehub.entity.Agendamento;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AvaliacaoService {

    @Autowired
    private AvaliacaoRepository avaliacaoRepository;

    @Autowired
    private CuidadorRepository cuidadorRepository;

    @Autowired
    private AgendamentoRepository agendamentoRepository;

    @Transactional
    public AvaliacaoResponseDTO criarAvaliacao(Long clienteId, AvaliacaoRequestDTO dto) {
        Long agendamentoId = java.util.Objects.requireNonNull(dto.getAgendamentoId(), "Agendamento ID is required");

        Agendamento agendamento = agendamentoRepository.findById(agendamentoId)
                .orElseThrow(() -> new RuntimeException("Agendamento não encontrado"));

        // Validar que o agendamento pertence ao cliente e ao cuidador informado
        if (!agendamento.getCliente().getId().equals(clienteId)) {
            throw new RuntimeException("Avaliador não é o cliente do agendamento");
        }

        if (!agendamento.getCuidador().getId().equals(dto.getCuidadorId())) {
            throw new RuntimeException("O cuidador informado não corresponde ao agendamento");
        }

        // Permitir avaliação apenas se o agendamento estiver concluído
        if (agendamento.getStatus() != Agendamento.StatusAgendamento.CONCLUIDO) {
            throw new RuntimeException("Somente é possível avaliar após o agendamento ser concluído");
        }

        // Se já existe avaliação para este agendamento, atualizar (reavaliação)
        Avaliacao existente = avaliacaoRepository.findByAgendamentoId(agendamentoId);
        Avaliacao avaliacao;
        if (existente != null) {
            existente.setNota(dto.getNota());
            existente.setComentario(dto.getComentario());
            avaliacao = avaliacaoRepository.save(existente);
        } else {
            avaliacao = new Avaliacao();
            avaliacao.setCuidador(agendamento.getCuidador());
            avaliacao.setCliente(agendamento.getCliente());
            avaliacao.setAgendamento(agendamento);
            avaliacao.setNota(dto.getNota());
            avaliacao.setComentario(dto.getComentario());
            avaliacao = avaliacaoRepository.save(avaliacao);
        }

        // Atualizar média do cuidador
        atualizarMediaCuidador(avaliacao.getCuidador());

        return toResponseDTO(avaliacao);
    }

    @Transactional(readOnly = true)
    public List<AvaliacaoResponseDTO> listarAvaliacoesCuidador(Long cuidadorId) {
        return avaliacaoRepository.findByCuidadorIdOrderByDataAvaliacaoDesc(cuidadorId).stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public void deletarAvaliacao(Long avaliacaoId) {
    Avaliacao avaliacao = avaliacaoRepository.findById(java.util.Objects.requireNonNull(avaliacaoId))
                .orElseThrow(() -> new RuntimeException("Avaliação não encontrada"));

        Cuidador cuidador = avaliacao.getCuidador();
        avaliacaoRepository.delete(avaliacao);

        // Atualizar média do cuidador
        atualizarMediaCuidador(cuidador);
    }

    private void atualizarMediaCuidador(Cuidador cuidador) {
        List<Avaliacao> avaliacoes = avaliacaoRepository.findByCuidadorOrderByDataAvaliacaoDesc(cuidador);
        
        if (avaliacoes.isEmpty()) {
            cuidador.setAvaliacaoMedia(BigDecimal.ZERO);
            cuidador.setTotalAvaliacoes(0);
        } else {
            double media = avaliacoes.stream()
                    .mapToInt(Avaliacao::getNota)
                    .average()
                    .orElse(0.0);
            
            cuidador.setAvaliacaoMedia(BigDecimal.valueOf(media).setScale(2, RoundingMode.HALF_UP));
            cuidador.setTotalAvaliacoes(avaliacoes.size());
        }

        cuidadorRepository.save(cuidador);
    }

    private AvaliacaoResponseDTO toResponseDTO(Avaliacao avaliacao) {
        AvaliacaoResponseDTO dto = new AvaliacaoResponseDTO();
        dto.setId(avaliacao.getId());
        dto.setCuidadorId(avaliacao.getCuidador().getId());
        dto.setCuidadorNome(avaliacao.getCuidador().getName());
        dto.setClienteId(avaliacao.getCliente().getId());
        dto.setClienteNome(avaliacao.getCliente().getName());
        dto.setNota(avaliacao.getNota());
        dto.setComentario(avaliacao.getComentario());
        dto.setDataAvaliacao(avaliacao.getDataAvaliacao());
        if (avaliacao.getAgendamento() != null) {
            dto.setAgendamentoId(avaliacao.getAgendamento().getId());
        }
        return dto;
    }
}
