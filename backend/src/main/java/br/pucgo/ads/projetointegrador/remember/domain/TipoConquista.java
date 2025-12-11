package br.pucgo.ads.projetointegrador.remember.domain;

import lombok.Getter;

import java.util.stream.Stream;

/**
 * Enum que representa os diferentes tipos de conquistas.
 * O valor armazenado no banco de dados é o 'codigo' (Integer).
 */
@Getter
public enum TipoConquista {

    DIARIO(1, "Diário"),
    LEMBRANCA(2, "lembrança"),
    DIAS_CONSECUTIVOS(3, "Dias Consecutivos"),
    MESES_ATIVOS(4, "Meses Ativos"),;

    private final int codigo;
    private final String descricao;

    TipoConquista(int codigo, String descricao) {
        this.codigo = codigo;
        this.descricao = descricao;
    }

    /**
     * Converte um código numérico de volta para o Enum correspondente.
     * @param codigo O código vindo do banco de dados (ex: 1).
     * @return O Enum correspondente (ex: GatilhoTipo.PALAVRA_CHAVE).
     * @throws IllegalArgumentException se o código for inválido.
     */
    public static TipoConquista of(int codigo) {
        return Stream.of(TipoConquista.values())
                .filter(g -> g.getCodigo() == codigo).findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Código de tipo de gatilho inválido: " + codigo));
    }

    public String formatarCodigoDescricao() {
        return String.format("%d - %s", this.codigo, this.descricao);
    }
}
