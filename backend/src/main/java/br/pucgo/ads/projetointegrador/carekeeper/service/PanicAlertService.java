package com.example.carekeeper.service;

import java.time.Instant;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.example.carekeeper.enums.EmailTemplate;
import com.example.carekeeper.model.ContactEmailEntity;
import com.example.carekeeper.model.UserEntity;
import com.example.carekeeper.dto.PanicAlertRequest;
import com.example.carekeeper.repository.UserRepository;
import com.example.carekeeper.service.ContactEmailService;
import com.example.carekeeper.service.SendEmailService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PanicAlertService {

    private final SendEmailService emailService;
    private final ContactEmailService contactEmailService;
    private final UserRepository userRepository;

    @Value("${STATIC_MAP_API_KEY}")
    private String staticMapApiKey;

    @Value("${panic.alert.image.path:src/main/resources/static/images/logo_unati_horizontal.png}")
    private String alertImagePath;

    public boolean sendPanicAlert(UUID userId, PanicAlertRequest request) {

        List<ContactEmailEntity> contatos = contactEmailService.getContactsByUserId(userId);
        if (contatos.isEmpty()) {
            return false; // nenhum contato encontrado
        }

        // Nome do usuário
        String userName = userRepository.findById(userId)
                .map(UserEntity::getName)
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
        placeholders.put("message", request.getLeitura());
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

        return true;
    }
}
