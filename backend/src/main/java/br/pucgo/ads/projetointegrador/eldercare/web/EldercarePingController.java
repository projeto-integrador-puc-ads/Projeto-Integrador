package br.pucgo.ads.projetointegrador.eldercare.web;

import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/eldercare")
@CrossOrigin(origins = "*") // liberar tudo em dev; depois pode restringir
public class EldercarePingController {

    @GetMapping("/ping")
    public Map<String, Object> ping() {
        return Map.of(
                "ok", true,
                "service", "eldercare",
                "ts", java.time.Instant.now().toString()
        );
    }
}
