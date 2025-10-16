package br.pucgo.ads.projetointegrador.remember.domain;

import lombok.Getter;
import java.util.stream.Stream;

/**
 * Enum que representa os possíveis status de uma Pergunta Cognitiva.
 * O valor armazenado no banco de dados é o 'codigo' (Integer).
 */
@Getter
public enum StatusPergunta {

    ENVIADA(1, "Enviada"),
    RESPONDIDA(2, "Respondida");

    private final int codigo;
    private final String descricao;

    StatusPergunta(int codigo, String descricao) {
        this.codigo = codigo;
        this.descricao = descricao;
    }

    /**
     * Converte um código numérico de volta para o Enum correspondente.
     * @param codigo O código vindo do banco de dados (ex: 1).
     * @return O Enum correspondente (ex: StatusPergunta.ENVIADA).
     * @throws IllegalArgumentException se o código for inválido.
     */
    public static StatusPergunta of(int codigo) {
        return Stream.of(StatusPergunta.values())
                .filter(s -> s.getCodigo() == codigo).findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Código de status de pergunta inválido: " + codigo));
    }
}
