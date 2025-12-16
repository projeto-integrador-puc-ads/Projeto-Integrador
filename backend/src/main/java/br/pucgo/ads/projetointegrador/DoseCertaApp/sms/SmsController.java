package br.pucgo.ads.projetointegrador.DoseCertaApp.sms;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import jakarta.validation.Valid;

import java.util.Map;

@RestController
@RequestMapping("/sms")
public class SmsController {

    private final SmsService smsService;

    @Autowired
    public SmsController(SmsService smsService) {
        this.smsService = smsService;
    }

    @PostMapping("/send")
    public ResponseEntity<?> sendSms(@Valid @RequestBody SendSmsRequest request) {
        try {
            String toSanitized = sanitizeNumber(request.getTo());
            String sid = smsService.sendSms(toSanitized, request.getMessage());
            return ResponseEntity.ok(Map.of("sid", sid));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // ============================================
    // Sanitizador correto para números brasileiros
    // ============================================
    private String sanitizeNumber(String to) {
        if (to == null || to.isBlank())
            throw new IllegalArgumentException("Número de telefone não pode ser vazio.");

        // remove tudo que não é número
        String digits = to.replaceAll("\\D", "");

        // se número já estiver no padrão E.164 (55 + 11 dígitos = 13)
        if (digits.startsWith("55") && digits.length() == 13) {
            return "+" + digits;
        }

        // se usuário digitou apenas DDD + celular (ex: 62985447005)
        if (digits.length() == 11) {
            return "+55" + digits;
        }

        // se digitou número fixo (10 dígitos) -> ainda é válido
        if (digits.length() == 10) {
            return "+55" + digits;
        }

        // fallback para números internacionais
        if (!digits.startsWith("55") && digits.length() > 11) {
            return "+" + digits;
        }

        throw new IllegalArgumentException("Número de telefone inválido: " + to);
    }
}
