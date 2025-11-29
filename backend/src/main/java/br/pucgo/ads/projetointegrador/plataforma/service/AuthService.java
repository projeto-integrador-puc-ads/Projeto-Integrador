package br.pucgo.ads.projetointegrador.plataforma.service;

import br.pucgo.ads.projetointegrador.plataforma.dto.JwtAuthResponse;
import br.pucgo.ads.projetointegrador.plataforma.dto.LoginDto;
import br.pucgo.ads.projetointegrador.plataforma.dto.SignupDto;

public interface AuthService {
    JwtAuthResponse login(LoginDto loginDto);
    String signup(SignupDto signupDto);
}