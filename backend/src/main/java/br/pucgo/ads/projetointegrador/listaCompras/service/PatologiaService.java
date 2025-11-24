package br.pucgo.ads.projetointegrador.listaCompras.service;


import br.pucgo.ads.projetointegrador.listaCompras.dto.PatologiaResponseDTO;
import br.pucgo.ads.projetointegrador.listaCompras.entity.Patologia;
import br.pucgo.ads.projetointegrador.listaCompras.repository.PatologiaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class PatologiaService {

    private final PatologiaRepository patologiaRepository;

    @Transactional(readOnly = true)
    public PatologiaResponseDTO findById(Long patologiaId) {
    Patologia patologia = patologiaRepository.findById(patologiaId).orElseThrow(() -> new IllegalArgumentException( "Patologia não encontrada com ID"));
    return toResponseDTO(patologia);
    }

    private PatologiaResponseDTO toResponseDTO (Patologia patologia){
        return new PatologiaResponseDTO(
                patologia.getId(),
                patologia.getNome(),
                patologia.getDescricao(),
                patologia.getCreatedAt(),
                patologia.getUpdatedAt()
        );
    }
}
