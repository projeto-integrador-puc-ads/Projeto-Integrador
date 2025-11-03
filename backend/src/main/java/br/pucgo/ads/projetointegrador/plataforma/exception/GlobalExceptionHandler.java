// src/main/java/br/pucgo/ads/projetointegrador/plataforma/exception/GlobalExceptionHandler.java

package br.pucgo.ads.projetointegrador.plataforma.exception;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import java.time.LocalDateTime;

@ControllerAdvice
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {

    // Manipulador para ApiException personalizada
    @ExceptionHandler(ApiException.class)
    public ResponseEntity<ErrorDetails> handleApiException(ApiException exception, WebRequest webRequest) {
        ErrorDetails errorDetails = new ErrorDetails(
                LocalDateTime.now(),
                exception.getMessage(),
                webRequest.getDescription(false),
                exception.getStatus().toString()
        );
        
        return new ResponseEntity<>(errorDetails, exception.getStatus());
    }
    
    // Manipulador para exceções de autenticação
    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ErrorDetails> handleBadCredentialsException(BadCredentialsException exception, WebRequest webRequest) {
        ErrorDetails errorDetails = new ErrorDetails(
                LocalDateTime.now(),
                "Credenciais inválidas. Verifique seu nome de usuário e senha.",
                webRequest.getDescription(false),
                "401"
        );
        
        return ResponseEntity.status(401).body(errorDetails);
    }
    
    // Manipulador para exceções de usuário não encontrado
    @ExceptionHandler(UsernameNotFoundException.class)
    public ResponseEntity<ErrorDetails> handleUsernameNotFoundException(UsernameNotFoundException exception, WebRequest webRequest) {
        ErrorDetails errorDetails = new ErrorDetails(
                LocalDateTime.now(),
                exception.getMessage(),
                webRequest.getDescription(false),
                "404"
        );
        
        return ResponseEntity.status(404).body(errorDetails);
    }
    
    // Manipulador para exceções de acesso negado
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ErrorDetails> handleAccessDeniedException(AccessDeniedException exception, WebRequest webRequest) {
        ErrorDetails errorDetails = new ErrorDetails(
                LocalDateTime.now(),
                "Você não tem permissão para acessar este recurso",
                webRequest.getDescription(false),
                "403"
        );
        
        return ResponseEntity.status(403).body(errorDetails);
    }
    
    // Manipulador para exceções não tratadas
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorDetails> handleGlobalException(Exception exception, WebRequest webRequest) {
        ErrorDetails errorDetails = new ErrorDetails(
                LocalDateTime.now(),
                exception.getMessage(),
                webRequest.getDescription(false),
                "500"
        );
        
        return ResponseEntity.status(500).body(errorDetails);
    }
    
    // Classe para detalhes do erro
    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class ErrorDetails {
        private LocalDateTime timestamp;
        private String message;
        private String path;
        private String errorCode;
    }
}