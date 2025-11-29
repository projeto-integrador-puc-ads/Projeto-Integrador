package com.example.carekeeper.service.detection;

import com.example.carekeeper.dto.SensorDTO;
import com.example.carekeeper.enums.AccidentType;
import com.example.carekeeper.enums.EmailTemplate;
import com.example.carekeeper.model.AccidentRecordEntity;
import com.example.carekeeper.model.ContactEmailEntity;
import com.example.carekeeper.model.UserEntity;
import com.example.carekeeper.repository.AccidentRecordRepository;
import com.example.carekeeper.repository.UserRepository;
import com.example.carekeeper.service.detection.AccidentDetection;
import com.example.carekeeper.service.ContactEmailService;
import com.example.carekeeper.service.SendEmailService;
import com.example.carekeeper.util.EnvironmentUtil;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.logging.Logger;
import java.util.UUID;

@Service
@Scope("prototype")
public class SensorService {

    private final SendEmailService emailService;
    private final AccidentDetection accidentDetection;
    private final EnvironmentUtil envUtil;
    private final ContactEmailService contactEmailService;
    private final AccidentRecordRepository accidentRecordRepo;
    private final UserRepository userRepository;
    private final ObjectMapper objectMapper;

    private SensorDTO lastReading;
    private boolean hasDetectedAccidents;

    @Value("${STATIC_MAP_API_KEY}")
    private String staticMapApiKey;

    private static final Logger logger = Logger.getLogger(SensorService.class.getName());

        public SensorService(
            SendEmailService emailService,
            AccidentDetection accidentDetection,
            EnvironmentUtil envUtil,
            ContactEmailService contactEmailService,
            AccidentRecordRepository accidentRecordRepo,
            UserRepository userRepository,
            ObjectMapper objectMapper
    ) {
        this.emailService = emailService;
        this.accidentDetection = accidentDetection;
        this.envUtil = envUtil;
        this.contactEmailService = contactEmailService;
        this.accidentRecordRepo = accidentRecordRepo;
        this.userRepository = userRepository;
        this.objectMapper = objectMapper;
    }

    /**
     * Processa uma leitura do sensor e envia e-mails de alerta se acidentes forem detectados.
     */
    public boolean processReading(UUID userId, SensorDTO currentReading, boolean isAlertActive) {
        if (isAlertActive || hasDetectedAccidents) {
            return true;
        }

        List<AccidentType> accidents = accidentDetection.check(userId, currentReading, lastReading, envUtil);
        lastReading = currentReading;
        hasDetectedAccidents = hasAccidents(accidents);

        if (hasDetectedAccidents) {
            try {
                // 🔹 Busca o nome do usuário
                String userName = userRepository.findById(userId)
                        .map(UserEntity::getName)
                        .orElse("Usuário");

                // Monta HTML dos alertas detectados
                StringBuilder alertsHtml = new StringBuilder();
                for (AccidentType accident : accidents) {
                    String descricaoPersonalizada = accident.getDescription().replace("{{name}}", userName);
                    alertsHtml.append("<div class='alert-item'>")
                              .append("<h2>").append(accident.getTitle()).append("</h2>")
                              .append("<p>").append(descricaoPersonalizada).append("</p>")
                              .append("</div>");
                }

                // Formata data e hora separadamente
                Instant timestampInstant = Instant.ofEpochMilli(currentReading.getTimestamp());
                DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("dd/MM/yyyy")
                        .withZone(ZoneId.of("America/Sao_Paulo"));
                DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("HH:mm:ss")
                        .withZone(ZoneId.of("America/Sao_Paulo"));

                String date = dateFormatter.format(timestampInstant);
                String time = timeFormatter.format(timestampInstant);

                // Mapeia placeholders
                Map<String, String> placeholders = new HashMap<>();
                placeholders.put("name", userName);
                placeholders.put("message", alertsHtml.toString());
                placeholders.put("date", date);
                placeholders.put("time", time);
                placeholders.put("latitude", String.valueOf(currentReading.getLatitude()));
                placeholders.put("longitude", String.valueOf(currentReading.getLongitude()));
                placeholders.put("STATIC_MAP_API_KEY", staticMapApiKey);

                // 🔹 Busca contatos do usuário
                List<ContactEmailEntity> contatos = contactEmailService.getContactsByUserId(userId);
                if (contatos.isEmpty()) {
                    logger.warning("Nenhum contato encontrado para o usuário " + userId);
                    return true;
                }

                // Caminho da imagem local embutida (logo Unati)
                String imagePath = "src/main/resources/static/images/logo_unati_horizontal.png";

                // Envia o e-mail para todos os contatos do usuário
                String subject = "🚨 " + accidents.size() + " acidente(s) detectado(s)";
                for (ContactEmailEntity contato : contatos) {
                    emailService.sendEmailWithInlineImage(
                            contato.getEmail(),
                            subject,
                            EmailTemplate.EMERGENCY_ALERT_TEMPLATE,
                            placeholders,
                            "unatiIcon", // deve coincidir com cid do HTML
                            imagePath
                    );
                }

                // Persiste os registros de acidentes detectados
                String sensorJson = objectMapper.writeValueAsString(currentReading);
                for (AccidentType at : accidents) {
                    AccidentRecordEntity record = new AccidentRecordEntity(
                            userId, sensorJson, at, currentReading.getTimestamp());
                    accidentRecordRepo.save(record);
                }

                if (envUtil.isDev()) {
                    logger.info("Alertas salvos no banco para userId=" + userId + " (count=" + accidents.size() + ")");
                }

            } catch (Exception e) {
                logger.severe("Erro ao processar alerta de acidente: " + e.getMessage());
            }
        }

        return hasDetectedAccidents;
    }

    private boolean hasAccidents(List<AccidentType> accidents) {
        return accidents != null && !accidents.isEmpty();
    }
}
