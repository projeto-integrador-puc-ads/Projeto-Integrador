package br.pucgo.ads.projetointegrador.remember.service;


import br.pucgo.ads.projetointegrador.plataforma.Exception.RecursoNaoEncontradoException;
import br.pucgo.ads.projetointegrador.remember.dto.Pergunta.PerguntaTemplateRequestDTO;
import br.pucgo.ads.projetointegrador.remember.dto.Pergunta.PerguntaTemplateResponseDTO;
import br.pucgo.ads.projetointegrador.remember.entity.PerguntaTemplate;
import br.pucgo.ads.projetointegrador.remember.repository.PerguntaTemplateRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PerguntaTemplateService {

    private final PerguntaTemplateRepository templateRepository;

    /**
     * Salva um novo template de pergunta no sistema.
     * @param requestDTO Os dados do template a ser criado.
     * @return O template salvo.
     */
    public PerguntaTemplateResponseDTO salvarTemplate(PerguntaTemplateRequestDTO requestDTO) {
        PerguntaTemplate novoTemplate = new PerguntaTemplate();

        novoTemplate.setTextoTemplate(requestDTO.getTextoTemplate());
        novoTemplate.setGatilhoTipo(requestDTO.getGatilhoTipo());
        novoTemplate.setGatilhoValores(requestDTO.getGatilhoValores());
        novoTemplate.setCampoAlvo(requestDTO.getCampoAlvo());
        novoTemplate.setCampoPlaceholder(requestDTO.getCampoPlaceholder());
        novoTemplate.setAtivo(requestDTO.isAtivo());

        PerguntaTemplate templateSalvo = templateRepository.save(novoTemplate);
        return new PerguntaTemplateResponseDTO(templateSalvo);
    }

    /**
     * Busca um template de pergunta pelo seu identificador.
     * @param identificador O ID do template.
     * @return Os dados do template encontrado.
     */
    public PerguntaTemplateResponseDTO buscarTemplatePorId(Long identificador) {
        PerguntaTemplate template = templateRepository.findById(identificador)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Template de pergunta não encontrado com o ID: " + identificador));
        return new PerguntaTemplateResponseDTO(template);
    }

    /**
     * Lista todos os templates de pergunta disponíveis no sistema.
     * @return Uma lista com todos os templates.
     */
    public List<PerguntaTemplateResponseDTO> listarTemplates() {
        return templateRepository.findAll().stream()
                .map(PerguntaTemplateResponseDTO::new)
                .collect(Collectors.toList());
    }

    /**
     * Atualiza um template de pergunta existente.
     * @param identificador O ID do template a ser atualizado.
     * @param requestDTO Os novos dados para o template.
     * @return O template com os dados atualizados.
     */
    public PerguntaTemplateResponseDTO atualizarTemplate(Long identificador, PerguntaTemplateRequestDTO requestDTO) {
        PerguntaTemplate templateExistente = templateRepository.findById(identificador)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Template de pergunta não encontrado com o ID: " + identificador));

        templateExistente.setTextoTemplate(requestDTO.getTextoTemplate());
        templateExistente.setGatilhoTipo(requestDTO.getGatilhoTipo());
        templateExistente.setGatilhoValores(requestDTO.getGatilhoValores());
        templateExistente.setCampoAlvo(requestDTO.getCampoAlvo());
        templateExistente.setCampoPlaceholder(requestDTO.getCampoPlaceholder());
        templateExistente.setAtivo(requestDTO.isAtivo());

        PerguntaTemplate templateAtualizado = templateRepository.save(templateExistente);
        return new PerguntaTemplateResponseDTO(templateAtualizado);
    }

    /**
     * Deleta um template de pergunta do sistema.
     * @param identificador O ID do template a ser deletado.
     */
    public void deletarTemplate(Long identificador) {
        if (!templateRepository.existsById(identificador)) {
            throw new RecursoNaoEncontradoException("Template de pergunta não encontrado com o ID: " + identificador);
        }
        templateRepository.deleteById(identificador);
    }
}
