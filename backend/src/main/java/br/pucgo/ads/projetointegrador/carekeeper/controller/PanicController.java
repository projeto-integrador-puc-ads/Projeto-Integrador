package com.example.carekeeper.controller;

import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;

import com.example.carekeeper.dto.PanicAlertRequest;
import com.example.carekeeper.service.PanicAlertService;

/**
 * Controller responsável por gerenciar alertas de pânico.
 * Todos os endpoints desta classe estão sob a rota base "/emergencia".
 */
@RestController
@RequestMapping("/api/emergencia")
@RequiredArgsConstructor
public class PanicController {

    private final PanicAlertService panicAlertService;

    /**
     * Este controlador lida com o acionamento manual do botão de pânico pelo aplicativo Android.
     * O objetivo é notificar os contatos de emergência do usuário autenticado, informando
     * sua localização e o contexto do alerta.
     *
     * Autenticação:
     * - O identificador do usuário (userId) é extraído automaticamente do token JWT.
     * - O cliente deve incluir o cabeçalho:
     *   Authorization: Bearer <token>
     *
     * Endpoint principal:
     * POST /emergencia/alerta
     *
     * Corpo da requisição (JSON):
     * {
     *   "leitura": "Botão de pânico acionado",
     *   "latitude": -23.56168,
     *   "longitude": -46.65584
     * }
     *
     * Retornos possíveis:
     * - 200 OK → O alerta foi processado e enviado com sucesso aos contatos do usuário.
     * - 204 No Content → Nenhum contato de emergência foi encontrado para o usuário.
     * - 401 Unauthorized → Token JWT ausente ou inválido.
     *
     * Observações:
     * - O campo `userId` não deve mais ser enviado no body nem como parâmetro de URL.
     * - A autenticação é feita automaticamente pelo filtro JWT.
     */
    @PostMapping("/alerta")
    public ResponseEntity<Void> triggerPanic(
            @RequestBody PanicAlertRequest request,
            Authentication authentication
    ) {
        // Obtém o ID do usuário a partir do token JWT
        UUID userId = UUID.fromString(authentication.getName());

        boolean sent = panicAlertService.sendPanicAlert(userId, request);

        // Retorna 200 OK se o alerta foi enviado, ou 204 se não havia contatos
        return sent ? ResponseEntity.ok().build() : ResponseEntity.noContent().build();
    }
}
