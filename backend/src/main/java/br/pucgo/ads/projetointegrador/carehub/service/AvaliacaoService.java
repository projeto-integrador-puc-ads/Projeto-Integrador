package br.pucgo.ads.projetointegrador.carehub.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.pucgo.ads.projetointegrador.carehub.dto.avaliacao.AvaliacaoRequestDTO;
import br.pucgo.ads.projetointegrador.carehub.dto.avaliacao.AvaliacaoResponseDTO;
import br.pucgo.ads.projetointegrador.carehub.entity.Avaliacao;
import br.pucgo.ads.projetointegrador.carehub.entity.Cliente;
import br.pucgo.ads.projetointegrador.carehub.entity.Cuidador;
import br.pucgo.ads.projetointegrador.carehub.repository.AvaliacaoRepository;
import br.pucgo.ads.projetointegrador.carehub.repository.ClienteRepository;
import br.pucgo.ads.projetointegrador.carehub.repository.CuidadorRepository;

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
    private ClienteRepository clienteRepository;

    @Transactional
    public AvaliacaoResponseDTO criarAvaliacao(Long clienteId, AvaliacaoRequestDTO dto) {
        Cuidador cuidador = cuidadorRepository.findById(java.util.Objects.requireNonNull(dto.getCuidadorId()))
                .orElseThrow(() -> new RuntimeException("Cuidador não encontrado"));

        Cliente cliente = clienteRepository.findById(java.util.Objects.requireNonNull(clienteId))
                .orElseThrow(() -> new RuntimeException("Cliente não encontrado com ID: " + clienteId));

        // Validação 1: Verificar se já avaliou
        if (avaliacaoRepository.existsByClienteIdAndCuidadorId(clienteId, dto.getCuidadorId())) {
            throw new RuntimeException("Você já avaliou este cuidador");
        }

        // Validação 2: Verificar se teve agendamento concluído
        if (!avaliacaoRepository.existsAgendamentoConcluido(clienteId, dto.getCuidadorId())) {
            throw new RuntimeException("Você só pode avaliar cuidadores que já te atenderam");
        }

        Avaliacao avaliacao = new Avaliacao();
        avaliacao.setCuidador(cuidador);
        avaliacao.setCliente(cliente);
        avaliacao.setNota(dto.getNota());
        avaliacao.setComentario(dto.getComentario());

        avaliacao = avaliacaoRepository.save(avaliacao);

        // Atualizar média do cuidador
        atualizarMediaCuidador(cuidador);

        return toResponseDTO(avaliacao);
    }

    @Transactional(readOnly = true)
    public boolean podeAvaliar(Long clienteId, Long cuidadorId) {
        java.util.Objects.requireNonNull(clienteId, "Cliente ID cannot be null");
        java.util.Objects.requireNonNull(cuidadorId, "Cuidador ID cannot be null");
        
        // Não pode avaliar se já avaliou
        if (avaliacaoRepository.existsByClienteIdAndCuidadorId(clienteId, cuidadorId)) {
            return false;
        }
        
        // Só pode avaliar se teve agendamento concluído
        return avaliacaoRepository.existsAgendamentoConcluido(clienteId, cuidadorId);
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
        return dto;
    }
}
