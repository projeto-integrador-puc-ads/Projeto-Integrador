package br.pucgo.ads.projetointegrador.carehub.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.pucgo.ads.projetointegrador.carehub.dto.prontuario.ProntuarioRequestDTO;
import br.pucgo.ads.projetointegrador.carehub.dto.prontuario.ProntuarioResponseDTO;
import br.pucgo.ads.projetointegrador.carehub.entity.Cliente;
import br.pucgo.ads.projetointegrador.carehub.entity.Prontuario;
import br.pucgo.ads.projetointegrador.carehub.repository.ClienteRepository;
import br.pucgo.ads.projetointegrador.carehub.repository.ProntuarioRepository;

import java.util.Objects;

@Service
public class ProntuarioService {

    @Autowired
    private ProntuarioRepository prontuarioRepository;

    @Autowired
    private ClienteRepository clienteRepository;

    @Transactional
    public ProntuarioResponseDTO criarProntuario(ProntuarioRequestDTO dto) {
        Long clienteId = Objects.requireNonNull(dto.getClienteId(), "Cliente ID cannot be null");
        
        Cliente cliente = clienteRepository.findById(clienteId)
                .orElseThrow(() -> new RuntimeException("Cliente não encontrado"));

        Prontuario prontuario = new Prontuario();
        prontuario.setCliente(cliente);
        prontuario.setDataNascimento(dto.getDataNascimento());
        prontuario.setHistoricoMedico(dto.getHistoricoMedico());
        prontuario.setMedicamentosUso(dto.getMedicamentosUso());
    prontuario.setAlergias(dto.getAlergias());
    prontuario.setContatoEmergencia(dto.getContatoEmergencia());
        prontuario.setObservacoesGerais(dto.getObservacoesGerais());
        prontuario.setTipoSanguineo(dto.getTipoSanguineo());
        prontuario.setNecessidadesEspeciais(dto.getNecessidadesEspeciais());

        prontuario = prontuarioRepository.save(prontuario);

        return toResponseDTO(prontuario);
    }

    @Transactional
    public ProntuarioResponseDTO atualizarProntuario(Long id, ProntuarioRequestDTO dto) {
        Objects.requireNonNull(id, "Prontuario ID cannot be null");
        
        Prontuario prontuario = prontuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Prontuário não encontrado"));

        prontuario.setDataNascimento(dto.getDataNascimento());
        prontuario.setHistoricoMedico(dto.getHistoricoMedico());
        prontuario.setMedicamentosUso(dto.getMedicamentosUso());
    prontuario.setAlergias(dto.getAlergias());
    prontuario.setContatoEmergencia(dto.getContatoEmergencia());
        prontuario.setObservacoesGerais(dto.getObservacoesGerais());
        prontuario.setTipoSanguineo(dto.getTipoSanguineo());
        prontuario.setNecessidadesEspeciais(dto.getNecessidadesEspeciais());

        prontuario = prontuarioRepository.save(prontuario);

        return toResponseDTO(prontuario);
    }

    @Transactional(readOnly = true)
    public ProntuarioResponseDTO buscarPorId(Long id) {
        Objects.requireNonNull(id, "Prontuario ID cannot be null");
        
        Prontuario prontuario = prontuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Prontuário não encontrado"));
        return toResponseDTO(prontuario);
    }

    @Transactional(readOnly = true)
    public ProntuarioResponseDTO buscarPorClienteId(Long clienteId) {
        Prontuario prontuario = prontuarioRepository.findByClienteId(clienteId)
                .orElseThrow(() -> new RuntimeException("Prontuário não encontrado para este cliente"));
        return toResponseDTO(prontuario);
    }

    private ProntuarioResponseDTO toResponseDTO(Prontuario prontuario) {
        ProntuarioResponseDTO dto = new ProntuarioResponseDTO();
        dto.setId(prontuario.getId());
        dto.setClienteId(prontuario.getCliente().getId());
        dto.setClienteNome(prontuario.getCliente().getName());
        dto.setDataNascimento(prontuario.getDataNascimento());
        dto.setHistoricoMedico(prontuario.getHistoricoMedico());
        dto.setMedicamentosUso(prontuario.getMedicamentosUso());
    dto.setAlergias(prontuario.getAlergias());
    dto.setContatoEmergencia(prontuario.getContatoEmergencia());
        dto.setObservacoesGerais(prontuario.getObservacoesGerais());
        dto.setTipoSanguineo(prontuario.getTipoSanguineo());
        dto.setNecessidadesEspeciais(prontuario.getNecessidadesEspeciais());
        dto.setDataCriacao(prontuario.getDataCriacao());
        dto.setDataAtualizacao(prontuario.getDataAtualizacao());
        return dto;
    }
}
