package br.pucgo.ads.projetointegrador.carehub.exception;

/**
 * Exceção lançada quando uma operação não é permitida por regras de negócio
 */
public class OperacaoNaoPermitidaException extends RuntimeException {
    public OperacaoNaoPermitidaException(String message) {
        super(message);
    }

    public OperacaoNaoPermitidaException(String message, Throwable cause) {
        super(message, cause);
    }
}
