package br.pucgo.ads.projetointegrador.plataforma.service.impl;

import br.pucgo.ads.projetointegrador.plataforma.dto.LoginDto;
import br.pucgo.ads.projetointegrador.plataforma.dto.SignupDto;
import br.pucgo.ads.projetointegrador.plataforma.entity.Role;
import br.pucgo.ads.projetointegrador.plataforma.entity.User;
import br.pucgo.ads.projetointegrador.plataforma.exception.ApiException;
import br.pucgo.ads.projetointegrador.plataforma.repository.RoleRepository;
import br.pucgo.ads.projetointegrador.plataforma.repository.UserRepository;
import br.pucgo.ads.projetointegrador.plataforma.security.JwtTokenProvider;
import br.pucgo.ads.projetointegrador.plataforma.service.AuthService;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashSet;

@Service
public class AuthServiceImpl implements AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;


    public AuthServiceImpl(AuthenticationManager authenticationManager,
                          UserRepository userRepository,
                          RoleRepository roleRepository,
                          PasswordEncoder passwordEncoder,
                          JwtTokenProvider jwtTokenProvider) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    @Override
    public String login(LoginDto loginDto) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginDto.getUsernameOrEmail(),
                        loginDto.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        return jwtTokenProvider.generateToken(authentication);
    }

    @Override
    public String signup(SignupDto signupDto) {
        if (userRepository.existsByUsername(signupDto.getUsername())) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Username already exists!");
        }

        if (userRepository.existsByEmail(signupDto.getEmail())) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Email already exists!");
        }
        Role role;

        if (signupDto.getRoleId() != null) {

            role = roleRepository.findById(signupDto.getRoleId())
                .orElseThrow(() ->
                    new ApiException(HttpStatus.BAD_REQUEST,
                        "Role não encontrada com ID: " + signupDto.getRoleId())
                );

        } else {
            role = roleRepository.findByName("USER")
                .orElseThrow(() ->
                    new ApiException(HttpStatus.BAD_REQUEST,
                        "Role não encontrada: USER")
                );
        }

        User user = new User();
        user.setName(signupDto.getName());
        user.setUsername(signupDto.getUsername());
        user.setEmail(signupDto.getEmail());
        user.setPassword(passwordEncoder.encode(signupDto.getPassword()));
        
        if (role.getName().equals("MEDICO")) {
            if (signupDto.getCrm() == null || signupDto.getCrm().isBlank()) {
                throw new ApiException(HttpStatus.BAD_REQUEST, "CRM é obrigatório para médicos.");
            }
            user.setCrm(signupDto.getCrm());
        }

        if (role.getName().equals("CUIDADOR")) {
            user.setCertificacao(signupDto.getCertificacao());
            user.setExperiencia(signupDto.getExperiencia());
        }

        user.setRole(role);
        userRepository.save(user);
        return "User registered successfully!";
    }
}