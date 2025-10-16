package br.pucgo.ads.projetointegrador.remember.domain;

import lombok.Getter;
import java.util.stream.Stream;

/**
 * Enum que representa os diferentes tipos de gatilhos para a geração de perguntas.
 * O valor armazenado no banco de dados é o 'codigo' (Integer).
 */
@Getter
public enum GatilhoTipo {

    PALAVRA_CHAVE(1, "Palavra-Chave"),
    GENERICO(2, "Genérico"),
    DATA_ESPECIAL(3, "Data Especial"),
    SENTIMENTO(4, "Sentimento");

    private final int codigo;
    private final String descricao;

    GatilhoTipo(int codigo, String descricao) {
        this.codigo = codigo;
        this.descricao = descricao;
    }

    /**
     * Converte um código numérico de volta para o Enum correspondente.
     * @param codigo O código vindo do banco de dados (ex: 1).
     * @return O Enum correspondente (ex: GatilhoTipo.PALAVRA_CHAVE).
     * @throws IllegalArgumentException se o código for inválido.
     */
    public static GatilhoTipo of(int codigo) {
        return Stream.of(GatilhoTipo.values())
                .filter(g -> g.getCodigo() == codigo).findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Código de tipo de gatilho inválido: " + codigo));
    }
}
