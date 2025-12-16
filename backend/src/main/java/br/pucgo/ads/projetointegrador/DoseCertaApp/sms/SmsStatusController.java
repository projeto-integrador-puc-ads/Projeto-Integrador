package br.pucgo.ads.projetointegrador.DoseCertaApp.sms;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/sms")
public class SmsStatusController {

    private final SmsService smsService;

    @Autowired
    public SmsStatusController(SmsService smsService) {
        this.smsService = smsService;
    }

    // Consulta direta do status pelo SID (útil no Postman)
    @GetMapping("/status/{sid}")
    public ResponseEntity<?> getStatus(@PathVariable String sid) {
        try {
            Map<String, String> status = smsService.fetchMessageStatus(sid);
            return ResponseEntity.ok(status);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}