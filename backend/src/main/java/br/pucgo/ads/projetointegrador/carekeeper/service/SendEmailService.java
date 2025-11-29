package com.example.carekeeper.service;

import com.example.carekeeper.enums.EmailTemplate;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.FileSystemResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Map;
import java.util.Objects;

@Service
public class SendEmailService {

    private final JavaMailSender mailSender;

    // Injeção por construtor
    public SendEmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    /**
     * Envia um e-mail usando um template HTML e substitui os placeholders.
     * Permite adicionar uma imagem inline.
     *
     * @param to           destinatário
     * @param subject      assunto (opcional, se nulo usa padrão)
     * @param template     template HTML (enum)
     * @param placeholders mapa de placeholders e valores
     * @param contentId    id da imagem inline (ex: "unatiIcon")
     * @param imagePath    caminho da imagem (em resources/static/images)
     */
    public void sendEmailWithInlineImage(String to,
                                         String subject,
                                         EmailTemplate template,
                                         Map<String, String> placeholders,
                                         String contentId,
                                         String imagePath) {
        try {
            // Carrega o template HTML
            ClassPathResource resource = new ClassPathResource(template.getPath());
            Path path = resource.getFile().toPath();
            String html = Files.readString(path);

            // Substitui placeholders {{chave}} → valor
            StringBuilder htmlBuilder = new StringBuilder(html);
            if (placeholders != null) {
                for (Map.Entry<String, String> entry : placeholders.entrySet()) {
                    String key = entry.getKey();
                    String value = Objects.toString(entry.getValue(), "");
                    int start = 0;
                    while ((start = htmlBuilder.indexOf("{{" + key + "}}", start)) != -1) {
                        htmlBuilder.replace(start, start + key.length() + 4, value);
                        start += value.length(); // avança para não entrar em loop infinito
                    }
                }
            }

            // Substitui timestamp automaticamente
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss");
            htmlBuilder = new StringBuilder(htmlBuilder.toString().replace("{{timestamp}}",
                    LocalDateTime.now().format(formatter)));

            // Cria mensagem de e-mail
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(to);
            helper.setSubject(subject != null ? subject : "Alerta de Emergência 🚨");
            helper.setText(htmlBuilder.toString(), true);

            // Adiciona imagem inline se houver
            if (imagePath != null && !imagePath.isEmpty() && contentId != null) {
                FileSystemResource image = new FileSystemResource(imagePath);
                helper.addInline(contentId, image);
            }

            // Envia e-mail
            mailSender.send(message);

        } catch (MessagingException | IOException e) {
            // Loga o erro para depuração
            e.printStackTrace();
        }
    }
}
