package br.pucgo.ads.projetointegrador.security;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "security.jwt")
public class JwtProperties {

    /**
     * Chave secreta compartilhada com o grupo Plataforma.
     * Por enquanto pode ser qualquer valor forte para testes.
     */
    private String secret = "troque-para-um-segredo-forte";

    /**
     * Issuer esperado no token (depois alinhar com o grupo Autenticação)
     */
    private String issuer = "eldercare-plataforma";

    public String getSecret() {
        return secret;
    }

    public void setSecret(String secret) {
        this.secret = secret;
    }

    public String getIssuer() {
        return issuer;
    }

    public void setIssuer(String issuer) {
        this.issuer = issuer;
    }
}
