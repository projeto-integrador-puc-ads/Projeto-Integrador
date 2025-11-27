package br.pucgo.ads.projetointegrador.listaCompras.service;


import br.pucgo.ads.projetointegrador.listaCompras.dto.PatologiaResponseDTO;
import br.pucgo.ads.projetointegrador.listaCompras.entity.Patologia;
import br.pucgo.ads.projetointegrador.listaCompras.repository.PatologiaRepository;
import br.pucgo.ads.projetointegrador.listaCompras.repository.UsuarioPatologiaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PatologiaService {

    private final PatologiaRepository patologiaRepository;
    private final UsuarioPatologiaRepository usuarioPatologiaRepository;

    @Transactional(readOnly = true)
    public PatologiaResponseDTO buscarPorId(Long patologiaId) {
        Patologia patologia = patologiaRepository.findById(patologiaId).orElseThrow(() -> new IllegalArgumentException( "Patologia não encontrada com ID"));
        return toResponseDTO(patologia);
    }

    @Transactional(readOnly = true)
    public List<PatologiaResponseDTO> listarPorUsuario(Long userId) {

        List<Long> patologiaIds = usuarioPatologiaRepository.findPatologiaIdsByUsuarioId(userId);
        if (patologiaIds == null || patologiaIds.isEmpty()) {
            return Collections.emptyList();
        }

        List<Patologia> patologias = patologiaRepository.findAllById(patologiaIds);

        return patologias.stream()
                .map(this::toResponseDTO)
                .toList();
    }

    private PatologiaResponseDTO toResponseDTO (Patologia patologia){
        return new PatologiaResponseDTO(
                patologia.getId(),
                patologia.getNome(),
                patologia.getDescricao()
        );
    }
}
