package com.example.carekeeper.controller.dto;

import lombok.Data;

/**
 * DTO para receber dados de login do usuário.
 */
@Data
public class LoginRequest {
    private String email;
    private String password;
}
