package br.pucgo.ads.projetointegrador.DoseCertaApp.sms;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/sms")
public class StatusCallbackController {

    private static final Logger logger = LoggerFactory.getLogger(StatusCallbackController.class);

    // Twilio faz POST com application/x-www-form-urlencoded contendo MessageSid, MessageStatus, To, From, ErrorCode, ErrorMessage...
    @PostMapping("/status-callback")
    public ResponseEntity<?> receiveStatusCallback(@RequestParam Map<String, String> params) {
        logger.info("Twilio status callback received: {}", params);
        // Aqui você pode salvar os params no banco para atualizar o status do SMS (ex: messageSid -> delivered)
        return ResponseEntity.ok().build();
    }
}