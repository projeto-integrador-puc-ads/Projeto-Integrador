package com.example.carekeeper.controller.dto;

import lombok.Data;

/**
 * DTO para retornar o token JWT após login.
 */
@Data
public class LoginResponse {
    private final String token;
}
