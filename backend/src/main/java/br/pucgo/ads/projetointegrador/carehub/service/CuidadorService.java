package br.pucgo.ads.projetointegrador.carehub.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.pucgo.ads.projetointegrador.carehub.dto.cuidador.CuidadorRequestDTO;
import br.pucgo.ads.projetointegrador.carehub.dto.cuidador.CuidadorResponseDTO;
import br.pucgo.ads.projetointegrador.carehub.entity.Cuidador;
import br.pucgo.ads.projetointegrador.carehub.repository.CuidadorRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CuidadorService {

    @Autowired
    private CuidadorRepository cuidadorRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public List<CuidadorResponseDTO> listarTodos() {
        return cuidadorRepository.findByAtivoTrue().stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    public Page<CuidadorResponseDTO> buscarComFiltros(String localizacao, String especialidade, 
                                                       Cuidador.Disponibilidade disponibilidade, 
                                                       Pageable pageable) {
        return cuidadorRepository.buscarComFiltros(localizacao, especialidade, disponibilidade, pageable)
                .map(this::toResponseDTO);
    }

    public CuidadorResponseDTO buscarPorId(Long id) {
        Cuidador cuidador = cuidadorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cuidador não encontrado"));
        return toResponseDTO(cuidador);
    }

    @Transactional
    public CuidadorResponseDTO atualizar(Long id, CuidadorRequestDTO dto) {
        Cuidador cuidador = cuidadorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cuidador não encontrado"));

        if (dto.getNome() != null) cuidador.setNome(dto.getNome());
        if (dto.getEmail() != null) cuidador.setEmail(dto.getEmail());
        if (dto.getSenha() != null) cuidador.setSenha(passwordEncoder.encode(dto.getSenha()));
        if (dto.getTelefone() != null) cuidador.setTelefone(dto.getTelefone());
        if (dto.getExperiencia() != null) cuidador.setExperiencia(dto.getExperiencia());
        if (dto.getEspecialidades() != null) cuidador.setEspecialidades(dto.getEspecialidades());
        if (dto.getLocalizacao() != null) cuidador.setLocalizacao(dto.getLocalizacao());
        if (dto.getDisponibilidade() != null) cuidador.setDisponibilidade(dto.getDisponibilidade());
        if (dto.getBiografia() != null) cuidador.setBiografia(dto.getBiografia());
        if (dto.getFotoPerfil() != null) cuidador.setFotoPerfil(dto.getFotoPerfil());

        cuidador = cuidadorRepository.save(cuidador);
        return toResponseDTO(cuidador);
    }

    @Transactional
    public void deletar(Long id) {
        Cuidador cuidador = cuidadorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cuidador não encontrado"));
        cuidador.setAtivo(false);
        cuidadorRepository.save(cuidador);
    }

    private CuidadorResponseDTO toResponseDTO(Cuidador cuidador) {
        CuidadorResponseDTO dto = new CuidadorResponseDTO();
        dto.setId(cuidador.getId());
        dto.setNome(cuidador.getNome());
        dto.setEmail(cuidador.getEmail());
        dto.setTelefone(cuidador.getTelefone());
        dto.setExperiencia(cuidador.getExperiencia());
        dto.setEspecialidades(cuidador.getEspecialidades());
        dto.setLocalizacao(cuidador.getLocalizacao());
        dto.setDisponibilidade(cuidador.getDisponibilidade());
        dto.setAvaliacaoMedia(cuidador.getAvaliacaoMedia());
        dto.setTotalAvaliacoes(cuidador.getTotalAvaliacoes());
        dto.setBiografia(cuidador.getBiografia());
        dto.setFotoPerfil(cuidador.getFotoPerfil());
        dto.setAtivo(cuidador.getAtivo());
        dto.setCriadoEm(cuidador.getCriadoEm());
        return dto;
    }
}
