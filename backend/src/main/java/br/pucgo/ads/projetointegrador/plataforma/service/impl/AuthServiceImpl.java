package br.pucgo.ads.projetointegrador.plataforma.service.impl;

import br.pucgo.ads.projetointegrador.plataforma.dto.JwtAuthResponse;
import br.pucgo.ads.projetointegrador.plataforma.dto.LoginDto;
import br.pucgo.ads.projetointegrador.plataforma.dto.SignupDto;
import br.pucgo.ads.projetointegrador.plataforma.entity.Permission;
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
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

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
    public JwtAuthResponse login(LoginDto loginDto) {
        // 1. Autenticar o usuário
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginDto.getUsernameOrEmail(),
                        loginDto.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        // 2. Gerar o token JWT
        String token = jwtTokenProvider.generateToken(authentication);

        // 3. Buscar usuário com role e permissões carregadas (query otimizada)
        User user = userRepository.findByUsernameOrEmailWithPermissions(loginDto.getUsernameOrEmail())
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Usuário não encontrado"));

        // 4. Combinar permissões do Role + Permissões diretas do User
        Set<Permission> allPermissions = new HashSet<>();
        
        // Permissões do Role
        if (user.getRole() != null && user.getRole().getPermissions() != null) {
            allPermissions.addAll(user.getRole().getPermissions());
        }
        
        // Permissões diretas do User
        if (user.getPermissions() != null) {
            allPermissions.addAll(user.getPermissions());
        }

        // 5. Montar o DTO de resposta
        JwtAuthResponse response = new JwtAuthResponse();
        response.setAccessToken(token);
        response.setTokenType("Bearer");
        response.setUserId(user.getId());
        response.setUsername(user.getUsername());
        response.setEmail(user.getEmail());
        response.setName(user.getName());
        
        if (user.getRole() != null) {
            response.setRoleName(user.getRole().getName());
            response.setRoleCode(user.getRole().getCode());
        }
        
        // Converter permissões para formato JSON {id: nome}
        Set<Map<String, Object>> permissionsJson = allPermissions.stream()
                .map(permission -> Map.of(
                        "id", (Object) permission.getId(),
                        "name", (Object) permission.getName(),
                        "module_id", (Object) (permission.getModule() != null ? permission.getModule().getId() : "")
                ))
                .collect(Collectors.toSet());
        
        response.setPermissions(permissionsJson);

        return response;
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
            role = roleRepository.findByName("ROLE_USER")
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