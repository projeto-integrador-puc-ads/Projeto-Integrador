package com.example.carekeeper.controller;

import com.example.carekeeper.service.auth.AuthService;
import com.example.carekeeper.controller.dto.LoginRequest;
import com.example.carekeeper.controller.dto.LoginResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/autenticacao")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    /**
     * Endpoint para login de usuários.
     *
     * Recebe um JSON com email e senha:
     * {
     *   "email": "usuario@exemplo.com",
     *   "password": "senha123"
     * }
     *
     * Retorna:
     * - 200 OK + { "token": "<JWT>" } se login válido
     * - 401 Unauthorized se login inválido
     */
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        String token = authService.login(request.getEmail(), request.getPassword());

        if (token == null) return ResponseEntity.status(401).build();

        return ResponseEntity.ok(new LoginResponse(token));
    }

    /**
     * Endpoint para logout de usuários.
     *
     * Este endpoint instrui o cliente a descartar o token JWT localmente e, caso
     * implementada, remove o token de um cache ou blacklist no servidor.
     * Como JWTs são stateless por natureza, não há invalidação automática no servidor
     * a menos que você mantenha uma lista de tokens revogados.
     *
     * Retorna sempre 200 OK para indicar que o logout foi processado com sucesso.
     *
     * @param authHeader Cabeçalho "Authorization" contendo o token JWT (Bearer <token>)
    */
    @PostMapping("/logout")
    public ResponseEntity<Void> logout(@RequestHeader(name = "Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        authService.invalidateToken(token);

        return ResponseEntity.ok().build();
    }
}
