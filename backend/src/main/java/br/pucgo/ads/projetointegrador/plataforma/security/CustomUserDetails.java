package br.pucgo.ads.projetointegrador.plataforma.security;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import br.pucgo.ads.projetointegrador.plataforma.entity.User;

import java.util.Collection;
import java.util.Set;

@Getter
@AllArgsConstructor
public class CustomUserDetails implements UserDetails {

    private final User user;
    private final Collection<? extends GrantedAuthority> authorities;

    public static CustomUserDetails fromUser(User user) {

        GrantedAuthority authority = new SimpleGrantedAuthority(user.getRole().getName());

        return new CustomUserDetails(
                user,
                Set.of(authority));
    }

    // Método para acessar o ID do usuário em @PreAuthorize
    public Long getId() {
        return user.getId();
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public String getPassword() {
        return user.getPassword();
    }

    @Override
    public String getUsername() {
        return user.getEmail();
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
