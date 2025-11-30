package br.pucgo.ads.projetointegrador.carekeeper.controller;

import br.pucgo.ads.projetointegrador.carekeeper.dto.SensorDTO;
import br.pucgo.ads.projetointegrador.carekeeper.service.detection.SensorService;
import br.pucgo.ads.projetointegrador.plataforma.security.CustomUserDetails;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;

/**
 * Controller responsável por gerenciar leituras de sensores e detectar possíveis acidentes.
 * Todos os endpoints desta classe estão sob a rota base "/monitor".
 */
@RestController
@RequestMapping("/api/monitor")
public class AccidentDetectionController {

    private final SensorService sensorService;

    public AccidentDetectionController(SensorService sensorService) {
        this.sensorService = sensorService;
    }

    /**
     * Recebe leituras de sensores enviadas pelo aplicativo Android e verifica possíveis acidentes.
     * 
     * Logs:
     * - O conteúdo do SensorDTO recebido é registrado para depuração.
     *
     * Autenticação:
     * - O identificador do usuário (userId) é extraído automaticamente do token JWT.
     * - O cliente deve incluir o cabeçalho Authorization: Bearer <token>.
     *
     * Endpoint principal:
     * POST /monitor/leitura
     *
     * Parâmetros:
     * - Corpo (JSON): {@link SensorDTO} contendo dados do acelerômetro, giroscópio e localização.
     * - Query param (opcional): ativo=true para indicar alerta manual (botão de pânico).
     *
     * Retornos possíveis:
     * - 200 OK → Um acidente foi detectado.
     * - 204 No Content → Nenhum evento crítico identificado.
     * - 401 Unauthorized → Token JWT ausente ou inválido.
     *
     * Exemplo de requisição:
     * POST /monitor/leitura?ativo=true
     * Authorization: Bearer <token>
     * {
     *   "ax": 0.12,
     *   "ay": 9.81,
     *   "az": 0.03,
     *   "gx": 0.01,
     *   "gy": -0.02,
     *   "gz": 0.03,
     *   "latitude": -23.56168,
     *   "longitude": -46.65584,
     *   "timestamp": 1698345600000
     * }
     */
    @PostMapping("/leitura")
    public ResponseEntity<Void> detectAccident(
            @RequestBody SensorDTO sensorDTO,
            Authentication authentication
    ) {
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        Long userId = userDetails.getUser().getId();
        boolean accidentDetected = sensorService.processReading(userId, sensorDTO);

        return accidentDetected
                ? ResponseEntity.ok().build()
                : ResponseEntity.noContent().build();
    }
}
