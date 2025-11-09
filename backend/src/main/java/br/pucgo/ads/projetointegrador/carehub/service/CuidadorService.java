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
import br.pucgo.ads.projetointegrador.carehub.entity.Especialidade;
import br.pucgo.ads.projetointegrador.carehub.repository.CuidadorRepository;
import br.pucgo.ads.projetointegrador.carehub.repository.EspecialidadeRepository;

import java.util.HashSet;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class CuidadorService {

    @Autowired
    private CuidadorRepository cuidadorRepository;

    @Autowired
    private EspecialidadeRepository especialidadeRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public List<CuidadorResponseDTO> listarTodos() {
        return cuidadorRepository.findByAtivoTrue().stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    public Page<CuidadorResponseDTO> buscarComFiltros(String localizacao, String especialidade, 
                                                       Boolean disponibilidade, 
                                                       Pageable pageable) {
        return cuidadorRepository.buscarComFiltros(localizacao, disponibilidade, pageable)
                .map(this::toResponseDTO);
    }

    public CuidadorResponseDTO buscarPorId(Long id) {
        Objects.requireNonNull(id, "Cuidador ID cannot be null");
        
        Cuidador cuidador = cuidadorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cuidador não encontrado"));
        return toResponseDTO(cuidador);
    }

    @Transactional
    public CuidadorResponseDTO atualizar(Long id, CuidadorRequestDTO dto) {
        Objects.requireNonNull(id, "Cuidador ID cannot be null");
        
        Cuidador cuidador = cuidadorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cuidador não encontrado"));

        if (dto.getNome() != null) cuidador.setName(dto.getNome());
        if (dto.getEmail() != null) cuidador.setEmail(dto.getEmail());
        if (dto.getSenha() != null) cuidador.setPassword(passwordEncoder.encode(dto.getSenha()));
        if (dto.getTelefone() != null) cuidador.setTelefone(dto.getTelefone());
        if (dto.getExperiencia() != null) cuidador.setExperiencia(dto.getExperiencia());
        
        // Mapear especialidades via tabela de junção
        if (dto.getEspecialidades() != null && !dto.getEspecialidades().isEmpty()) {
            Set<Especialidade> especialidades = new HashSet<>();
            for (String nomeEspecialidade : dto.getEspecialidades()) {
                Especialidade especialidade = especialidadeRepository.findByNomeIgnoreCase(nomeEspecialidade)
                    .orElseGet(() -> {
                        // Criar nova especialidade se não existir
                        Especialidade nova = new Especialidade();
                        nova.setNome(nomeEspecialidade);
                        return especialidadeRepository.save(nova);
                    });
                especialidades.add(especialidade);
            }
            cuidador.setEspecialidades(especialidades);
        }
        
        if (dto.getDisponibilidade() != null) cuidador.setDisponibilidade(dto.getDisponibilidade());
        if (dto.getLocalizacao() != null) {
            // heurística simples: "Cidade-UF" ou apenas Cidade
            String loc = dto.getLocalizacao();
            if (loc.contains("-")) {
                String[] parts = loc.split("-");
                cuidador.setCidade(parts[0].trim());
                cuidador.setEstado(parts[1].trim().substring(0, Math.min(2, parts[1].trim().length())).toUpperCase());
            } else {
                cuidador.setCidade(loc);
            }
        }
        if (dto.getBiografia() != null) cuidador.setBiografia(dto.getBiografia());
        if (dto.getFotoPerfil() != null) cuidador.setFotoPerfil(dto.getFotoPerfil());

        Objects.requireNonNull(cuidador, "Cuidador cannot be null");
        cuidador = cuidadorRepository.save(cuidador);
        return toResponseDTO(cuidador);
    }

    @Transactional
    public void deletar(Long id) {
        Objects.requireNonNull(id, "Cuidador ID cannot be null");
        
        Cuidador cuidador = cuidadorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cuidador não encontrado"));
        cuidador.setAtivo(false);
        cuidadorRepository.save(cuidador);
    }

    private CuidadorResponseDTO toResponseDTO(Cuidador cuidador) {
        CuidadorResponseDTO dto = new CuidadorResponseDTO();
        dto.setId(cuidador.getId());
        dto.setNome(cuidador.getName());
        dto.setEmail(cuidador.getEmail());
        dto.setTelefone(cuidador.getTelefone());
    dto.setExperiencia(cuidador.getExperiencia());
    dto.setEspecialidades(null); // não mapeado ainda
    dto.setCidade(cuidador.getCidade());
    dto.setEstado(cuidador.getEstado());
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
