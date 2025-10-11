package br.pucgo.ads.projetointegrador.carehub.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.pucgo.ads.projetointegrador.carehub.dto.cliente.ClienteRequestDTO;
import br.pucgo.ads.projetointegrador.carehub.dto.cliente.ClienteResponseDTO;
import br.pucgo.ads.projetointegrador.carehub.entity.Cliente;
import br.pucgo.ads.projetointegrador.carehub.repository.ClienteRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ClienteService {

    @Autowired
    private ClienteRepository clienteRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public List<ClienteResponseDTO> listarTodos() {
        return clienteRepository.findByAtivoTrue().stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    public ClienteResponseDTO buscarPorId(Long id) {
        Cliente cliente = clienteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cliente não encontrado"));
        return toResponseDTO(cliente);
    }

    @Transactional
    public ClienteResponseDTO atualizar(Long id, ClienteRequestDTO dto) {
        Cliente cliente = clienteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cliente não encontrado"));

        if (dto.getNome() != null) cliente.setNome(dto.getNome());
        if (dto.getEmail() != null) cliente.setEmail(dto.getEmail());
        if (dto.getSenha() != null) cliente.setSenha(passwordEncoder.encode(dto.getSenha()));
        if (dto.getTelefone() != null) cliente.setTelefone(dto.getTelefone());
        if (dto.getNecessidades() != null) cliente.setNecessidades(dto.getNecessidades());
        if (dto.getEndereco() != null) cliente.setEndereco(dto.getEndereco());
        if (dto.getTelefoneEmergencia() != null) cliente.setTelefoneEmergencia(dto.getTelefoneEmergencia());
        if (dto.getContatoEmergencia() != null) cliente.setContatoEmergencia(dto.getContatoEmergencia());
        if (dto.getTipoCliente() != null) cliente.setTipoCliente(dto.getTipoCliente());

        cliente = clienteRepository.save(cliente);
        return toResponseDTO(cliente);
    }

    @Transactional
    public void deletar(Long id) {
        Cliente cliente = clienteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cliente não encontrado"));
        cliente.setAtivo(false);
        clienteRepository.save(cliente);
    }

    private ClienteResponseDTO toResponseDTO(Cliente cliente) {
        ClienteResponseDTO dto = new ClienteResponseDTO();
        dto.setId(cliente.getId());
        dto.setNome(cliente.getNome());
        dto.setEmail(cliente.getEmail());
        dto.setTelefone(cliente.getTelefone());
        dto.setNecessidades(cliente.getNecessidades());
        dto.setEndereco(cliente.getEndereco());
        dto.setTelefoneEmergencia(cliente.getTelefoneEmergencia());
        dto.setContatoEmergencia(cliente.getContatoEmergencia());
        dto.setTipoCliente(cliente.getTipoCliente());
        dto.setAtivo(cliente.getAtivo());
        dto.setCriadoEm(cliente.getCriadoEm());
        return dto;
    }
}
