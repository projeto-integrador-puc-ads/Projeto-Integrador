package br.pucgo.ads.projetointegrador.plataforma.exception;

public class UserNotFoundException extends RuntimeException {
    public UserNotFoundException(String message) {
        super(message);
    }
}