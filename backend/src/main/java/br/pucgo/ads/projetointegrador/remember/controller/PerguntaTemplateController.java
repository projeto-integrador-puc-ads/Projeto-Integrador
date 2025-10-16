package br.pucgo.ads.projetointegrador.remember.controller;

import br.pucgo.ads.projetointegrador.remember.dto.Pergunta.PerguntaTemplateRequestDTO;
import br.pucgo.ads.projetointegrador.remember.dto.Pergunta.PerguntaTemplateResponseDTO;
import br.pucgo.ads.projetointegrador.remember.service.PerguntaTemplateService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pergunta-templates")
@RequiredArgsConstructor
public class PerguntaTemplateController {

    private final PerguntaTemplateService templateService;

    /**
     * Cria um template de pergunta.
     * (Acesso restrito a administradores)
     */
    @PostMapping
    public ResponseEntity<PerguntaTemplateResponseDTO> salvarTemplate(@Valid @RequestBody PerguntaTemplateRequestDTO requestDTO) {
        PerguntaTemplateResponseDTO novoTemplate = templateService.salvarTemplate(requestDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(novoTemplate);
    }

    /**
     * Busca um template específico pelo seu identificador.
     */
    @GetMapping("/{identificador}")
    public ResponseEntity<PerguntaTemplateResponseDTO> buscarTemplatePorId(@PathVariable Long identificador) {
        PerguntaTemplateResponseDTO template = templateService.buscarTemplatePorId(identificador);
        return ResponseEntity.ok(template);
    }

    /**
     * Lista todos os templates de pergunta disponíveis no sistema.
     */
    @GetMapping
    public ResponseEntity<List<PerguntaTemplateResponseDTO>> listarTemplates() {
        List<PerguntaTemplateResponseDTO> templates = templateService.listarTemplates();
        return ResponseEntity.ok(templates);
    }

    /**
     * Atualiza um template de pergunta existente.
     * (Acesso restrito a administradores)
     */
    @PutMapping("/{identificador}")
    public ResponseEntity<PerguntaTemplateResponseDTO> atualizarTemplate(
            @PathVariable Long identificador,
            @Valid @RequestBody PerguntaTemplateRequestDTO requestDTO
    ) {
        PerguntaTemplateResponseDTO templateAtualizado = templateService.atualizarTemplate(identificador, requestDTO);
        return ResponseEntity.ok(templateAtualizado);
    }

    /**
     * Deleta um template de pergunta do sistema.
     * (Acesso restrito a administradores)
     */
    @DeleteMapping("/{identificador}")
    public ResponseEntity<Void> deletarTemplate(@PathVariable Long identificador) {
        templateService.deletarTemplate(identificador);
        return ResponseEntity.noContent().build();
    }
}
