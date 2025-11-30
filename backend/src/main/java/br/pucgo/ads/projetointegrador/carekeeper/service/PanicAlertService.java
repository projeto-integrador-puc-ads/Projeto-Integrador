package br.pucgo.ads.projetointegrador.carekeeper.service;

import java.time.Instant;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import br.pucgo.ads.projetointegrador.carekeeper.enums.EmailTemplate;
import br.pucgo.ads.projetointegrador.carekeeper.enums.AccidentType;
import br.pucgo.ads.projetointegrador.carekeeper.entity.AccidentRecordEntity;
import com.fasterxml.jackson.databind.ObjectMapper;
import br.pucgo.ads.projetointegrador.plataforma.entity.User;
import br.pucgo.ads.projetointegrador.carekeeper.dto.SensorDTO;
import br.pucgo.ads.projetointegrador.carekeeper.entity.ContactEmailEntity;
import br.pucgo.ads.projetointegrador.plataforma.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PanicAlertService {

    private static final Logger log = LoggerFactory.getLogger(PanicAlertService.class);

    private final SendEmailService emailService;
    private final ContactEmailService contactEmailService;
    private final UserRepository userRepository;
    private final AccidentRecordService accidentRecordService;
    private final ObjectMapper objectMapper;

    @Value("${app.static-map-api-key}")
    private String staticMapApiKey;

    @Value("${panic.alert.image.path:static/images/logo_unati_horizontal.png}")
    private String alertImagePath;

    @SuppressWarnings("null")
    public boolean sendPanicAlert(Long userId, SensorDTO request) {

        List<ContactEmailEntity> contatos = contactEmailService.getContactsByUserId(userId);
        
        if (contatos.isEmpty()) {
            return false; 
        }

        // Nome do usuário
        String userName = userRepository.findById(userId)
                .map(User::getName)
                .orElse("Usuário");

        Instant now = Instant.now();

        DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("dd/MM/yyyy")
                .withZone(ZoneId.of("America/Sao_Paulo"));
        DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("HH:mm:ss")
                .withZone(ZoneId.of("America/Sao_Paulo"));

        String date = dateFormatter.format(now);
        String time = timeFormatter.format(now);

        // Placeholders do template
        Map<String, String> placeholders = new HashMap<>();
        placeholders.put("message", "Botão de pânico acionado");
        placeholders.put("latitude", String.valueOf(request.getLatitude()));
        placeholders.put("longitude", String.valueOf(request.getLongitude()));
        placeholders.put("STATIC_MAP_API_KEY", staticMapApiKey);
        placeholders.put("name", userName);
        placeholders.put("date", date);
        placeholders.put("time", time);
        placeholders.put("timestamp", date + " " + time);

        // Envia e-mail para todos os contatos
        for (ContactEmailEntity contato : contatos) {
            emailService.sendEmailWithInlineImage(
                contato.getEmail(),
                "Alerta de Emergência 🚨",  
                EmailTemplate.PANIC_ALERT,
                placeholders,
                "unatiIcon",       
                alertImagePath   
            );
        }

        try {
            String sensorJson;
            try {
                sensorJson = objectMapper.writeValueAsString(request);
            } catch (Exception e) {
                log.error("Erro ao serializar SensorDTO, usando fallback: {}", e.getMessage());
                sensorJson = "{\"latitude\":" + request.getLatitude() + ",\"longitude\":" + request.getLongitude() + "}";
            }

            long detectedAt = Instant.now().toEpochMilli();
            AccidentRecordEntity record = new AccidentRecordEntity(userId, sensorJson, AccidentType.PANIC_ALERT, detectedAt);
            accidentRecordService.save(record);
            log.info("Registro de acidente salvo: {}", record);
        } catch (Exception e) {
            log.error("Erro ao salvar registro de acidente: {}", e.getMessage(), e);
        }

        return true;
    }
}
