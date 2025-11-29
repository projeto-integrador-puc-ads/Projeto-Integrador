package com.example.carekeeper.controller;

import com.example.carekeeper.model.UserEntity;
import com.example.carekeeper.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

/**
 * Controlador REST para operações relacionadas a usuários.
 */
@RestController
@RequestMapping("/api/usuarios")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    /**
     * Retorna todos os usuários.
     * Exemplo: GET /api/users
     */
    @GetMapping
    public ResponseEntity<List<UserEntity>> getAllUsers() {
        List<UserEntity> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    /**
     * Retorna um usuário pelo seu ID.
     * Exemplo: GET /api/users/{id}
    */
    @GetMapping("/{id}")
    public ResponseEntity<?> getUserById(@PathVariable UUID id) {
        UserEntity user = userService.getUserById(id);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Usuário não encontrado");
        }
        return ResponseEntity.ok(user);
    }


    /**
     * Retorna o total de usuários cadastrados.
     * Exemplo: GET /usuarios/total
    */
    @GetMapping("/total")
    public long getTotalUsers() {
        return userService.getTotalUsers();
    }
}
