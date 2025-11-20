package br.pucgo.ads.projetointegrador.eldercare.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/eldercare/auth")
public class AuthDebugController {

    @GetMapping("/me")
    public ResponseEntity<?> me() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth == null) {
            // ninguém autenticado (token não enviado ou inválido)
            return ResponseEntity.ok(
                    new SimpleAuthInfo("ANONYMOUS", "Nenhum usuário autenticado", "")
            );
        }

        String userId = auth.getName(); // vem do sub do token
        String authorities = auth.getAuthorities()
                .stream()
                .map(Object::toString)
                .collect(Collectors.joining(","));

        return ResponseEntity.ok(
                new SimpleAuthInfo(userId, "Usuário autenticado", authorities)
        );
    }

    // DTOzinho interno só pra resposta bonitinha
    public record SimpleAuthInfo(
            String userId,
            String message,
            String roles
    ) {}
}
