package com.example.carekeeper.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import io.jsonwebtoken.Jws;

import jakarta.annotation.PostConstruct;
import javax.crypto.SecretKey;
import java.time.Instant;
import java.util.Base64;
import java.util.Date;

@Component
public class JwtUtil {

    private SecretKey secretKey;
    private final long expirationMs = 1000 * 60 * 60; // 1h

    @Value("${jwt.secret:}")
    private String envSecret; 

    @PostConstruct
    public void init() {
        if (envSecret != null && !envSecret.isEmpty()) {
            byte[] keyBytes = Base64.getDecoder().decode(envSecret);
            secretKey = Keys.hmacShaKeyFor(keyBytes);
            System.out.println("✅ JWT secret carregado do application.properties");
        } else {
            throw new IllegalStateException("❌ jwt.secret não configurado — defina no application.properties");
        }
    }

    public String generateToken(String userId) {
        return Jwts.builder()
                .setSubject(userId)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expirationMs))
                .signWith(secretKey)
                .compact();
    }

    public String getUserIdFromToken(String token) {
        // parseClaimsJws agora é chamado diretamente do Jwts
        Jws<Claims> claims = Jwts.parserBuilder()
                .setSigningKey(secretKey)
                .build()
                .parseClaimsJws(token);

        return claims.getBody().getSubject();
    }

    public Instant getExpirationFromToken(String token) {
        Jws<Claims> claims = Jwts.parserBuilder()
                .setSigningKey(secretKey)
                .build()
                .parseClaimsJws(token);

        return claims.getBody().getExpiration().toInstant();
    }
}
