package br.pucgo.ads.projetointegrador.diario_saude.controller;

import br.pucgo.ads.projetointegrador.diario_saude.dto.PerguntaDTO;
import br.pucgo.ads.projetointegrador.diario_saude.entity.PerguntaEntity;
import br.pucgo.ads.projetointegrador.diario_saude.repository.PerguntaRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/diario_saude/questionario")
public class PerguntaController {

    private final PerguntaRepository perguntaRepository;
    private final ObjectMapper objectMapper;

    public PerguntaController(PerguntaRepository perguntaRepository, ObjectMapper objectMapper) {
        this.perguntaRepository = perguntaRepository;
        this.objectMapper = objectMapper;
    }

    // Retorna todas as perguntas
    @GetMapping("/perguntas")
    public List<PerguntaDTO> listarPerguntas() {
        List<PerguntaEntity> perguntas = perguntaRepository.findAll();

        return perguntas.stream().map(p -> {
            Map<String, Integer> opcoesMap = null;
            try {
                opcoesMap = objectMapper.readValue(p.getOpcoesJson(), new TypeReference<Map<String, Integer>>() {});
            } catch (Exception e) {
                e.printStackTrace();
            }
            return new PerguntaDTO(
                    p.getId(),
                    p.getTexto(),
                    opcoesMap
            );
        }).collect(Collectors.toList());
    }

    // Adicionar pergunta (opcional)
    @PostMapping("/perguntas")
    public PerguntaEntity adicionarPergunta(@RequestBody PerguntaEntity pergunta) {
        return perguntaRepository.save(pergunta);
    }
}
