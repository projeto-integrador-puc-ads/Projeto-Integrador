package br.pucgo.ads.projetointegrador.plataforma.config;

import br.pucgo.ads.projetointegrador.plataforma.security.JwtAuthenticationEntryPoint;
import br.pucgo.ads.projetointegrador.plataforma.security.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationEntryPoint authenticationEntryPoint;
    private final JwtAuthenticationFilter authenticationFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                // ✅ Endpoints PÚBLICOS (sem autenticação)
                .requestMatchers("/api/auth/**").permitAll()
                
                // ⚠️ TEMPORÁRIO: Rotas dos grupos LIBERADAS para desenvolvimento
                // TODO: Trocar .permitAll() por .authenticated() antes de produção
                .requestMatchers("/api/grupo1/**").permitAll()
                .requestMatchers("/api/grupo2/**").permitAll()
                .requestMatchers("/api/grupo3/**").permitAll()
                .requestMatchers("/api/grupo4/**").permitAll()
                .requestMatchers("/api/grupo5/**").permitAll()
                .requestMatchers("/api/grupo6/**").permitAll()
                
                // ⚠️ TEMPORÁRIO: Endpoints de usuários LIBERADOS para desenvolvimento
                // TODO: Trocar .permitAll() por .authenticated() antes de produção
                .requestMatchers("/api/users/**").permitAll()
                
                // ⚠️ TEMPORÁRIO: Qualquer outra rota LIBERADA (desenvolvimento)
                // Isso permite que grupos criem novas rotas sem configurar aqui
                // TODO: Trocar .permitAll() por .authenticated() antes de produção
                .anyRequest().permitAll()
            )
            .exceptionHandling(ex -> ex
                .authenticationEntryPoint(authenticationEntryPoint)
            )
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            );

        http.addFilterBefore(authenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }
}