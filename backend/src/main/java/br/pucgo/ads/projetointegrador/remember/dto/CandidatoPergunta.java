package br.pucgo.ads.projetointegrador.remember.dto;

import br.pucgo.ads.projetointegrador.remember.entity.PerguntaTemplate;
import lombok.AllArgsConstructor;
import lombok.Data;

/**
 * Classe auxiliar que representa uma combinação candidata de uma memória
 * com um template de pergunta aplicável, junto com a contagem de uso
 * histórico daquele template para o usuário.
 */
@Data
@AllArgsConstructor
public class CandidatoPergunta {

    private Object memoria;
    private PerguntaTemplate template;
    private long usoCount;

}
