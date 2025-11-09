package br.pucgo.ads.projetointegrador.carehub.config;

import br.pucgo.ads.projetointegrador.plataforma.security.JwtAuthenticationEntryPoint;
import br.pucgo.ads.projetointegrador.plataforma.security.JwtAuthenticationFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfigurationSource;

/**
 * Configuração de segurança específica para o módulo CareHub.
 * 
 * Esta configuração é executada ANTES da SecurityConfig da plataforma (Order 1)
 * e configura as regras de acesso específicas para os endpoints /api/carehub/**
 * 
 * IMPORTANTE: Esta config reutiliza os beans de autenticação JWT da plataforma
 * (JwtAuthenticationFilter, JwtAuthenticationEntryPoint, carehubCorsConfigurationSource)
 */
@Configuration
@EnableWebSecurity
public class CareHubSecurityConfig {

    @Autowired
    private JwtAuthenticationEntryPoint authenticationEntryPoint;
    
    @Autowired
    private JwtAuthenticationFilter authenticationFilter;
    
    @Autowired
    private CorsConfigurationSource carehubCorsConfigurationSource;

    @Bean
    @Order(1) // Executa ANTES da configuração da plataforma
    public SecurityFilterChain careHubFilterChain(HttpSecurity http) throws Exception {
        http
            .securityMatcher("/api/carehub/**") // Aplica APENAS para /api/carehub/**
            .cors(cors -> cors.configurationSource(carehubCorsConfigurationSource))
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/carehub/health").permitAll() // Health check público
                .anyRequest().authenticated() // Todos os outros endpoints requerem autenticação
            )
            .exceptionHandling(ex -> ex
                .authenticationEntryPoint(authenticationEntryPoint)
            )
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            );
        
        // Adiciona o filtro JWT antes do filtro de autenticação padrão
        http.addFilterBefore(authenticationFilter, UsernamePasswordAuthenticationFilter.class);
        
        return http.build();
    }
}
