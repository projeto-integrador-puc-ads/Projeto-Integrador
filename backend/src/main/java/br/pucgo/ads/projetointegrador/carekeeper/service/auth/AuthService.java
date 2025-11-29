package com.example.carekeeper.service.auth;

import com.example.carekeeper.model.UserEntity;
import com.example.carekeeper.security.JwtUtil;
import com.example.carekeeper.service.UserService;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class AuthService {

    // Map para armazenar tokens inválidos + timestamp de expiração
    private final Map<String, Instant> tokenBlacklist = new ConcurrentHashMap<>();

    private final JwtUtil jwtUtil;
    private final UserService userService;

    public AuthService(JwtUtil jwtUtil, UserService userService) {
        this.jwtUtil = jwtUtil;
        this.userService = userService;
    }

    public String login(String email, String password) {
        var user = userService.validateUser(email, password);
        if (user == null) return null;

        return jwtUtil.generateToken(user.getId().toString());
    }

    /**
     * Invalida um token adicionando-o à blacklist.
     */
    public void invalidateToken(String token) {
        Instant expiration = jwtUtil.getExpirationFromToken(token);
        if (expiration != null) {
            tokenBlacklist.put(token, expiration);
        }
    }

    /**
     * Verifica se um token está na blacklist.
     */
    public boolean isTokenInvalid(String token) {
        Instant exp = tokenBlacklist.get(token);
        if (exp == null) return false;

        // Remove automaticamente tokens expirados da blacklist
        if (Instant.now().isAfter(exp)) {
            tokenBlacklist.remove(token);
            return false;
        }
        return true;
    }
}
