package br.pucgo.ads.projetointegrador.DoseCertaApp.sms;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import jakarta.annotation.PostConstruct;

import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.rest.api.v2010.account.MessageCreator;
import com.twilio.type.PhoneNumber;
import com.twilio.exception.ApiException;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.HashMap;
import java.util.Map;

@Service
public class SmsService {

    @Value("${twilio.account-sid}")
    private String accountSid;

    @Value("${twilio.auth-token}")
    private String authToken;

    @Value("${twilio.from}")
    private String fromNumber;

    @PostConstruct
    public void init() {
        Twilio.init(accountSid, authToken);
    }

    // Envio simples
    public String sendSms(String to, String body) {
        try {
            Message message = Message.creator(
                    new PhoneNumber(to),       // PhoneNumber aqui está correto
                    new PhoneNumber(fromNumber),
                    body
            ).create();
            return message.getSid();
        } catch (ApiException e) {
            String details = String.format("Twilio ApiException: status=%d, code=%s, message=%s, moreInfo=%s",
                    e.getStatusCode(),
                    e.getCode(),
                    e.getMessage(),
                    e.getMoreInfo());
            throw new RuntimeException(details, e);
        }
    }

    // Envio com statusCallback
    public String sendSms(String to, String body, String statusCallbackUrl) {
        try {
            MessageCreator creator = Message.creator(
                    new PhoneNumber(to),
                    new PhoneNumber(fromNumber),
                    body
            );
            if (statusCallbackUrl != null && !statusCallbackUrl.isBlank()) {
                creator.setStatusCallback(new URI(statusCallbackUrl));
            }
            Message message = creator.create();
            return message.getSid();
        } catch (URISyntaxException e) {
            throw new RuntimeException("URL inválida para statusCallback: " + statusCallbackUrl, e);
        } catch (ApiException e) {
            String details = String.format("Twilio ApiException: status=%d, code=%s, message=%s, moreInfo=%s",
                    e.getStatusCode(),
                    e.getCode(),
                    e.getMessage(),
                    e.getMoreInfo());
            throw new RuntimeException(details, e);
        }
    }

    // Busca status pelo SID (String)
    public Map<String, String> fetchMessageStatus(String sid) {
        try {
            Message message = Message.fetcher(sid).fetch(); // <-- aqui deve ser uma String, NUNCA PhoneNumber
            Map<String, String> result = new HashMap<>();
            result.put("sid", message.getSid());
            result.put("status", message.getStatus() != null ? message.getStatus().toString() : null);
            result.put("to", message.getTo());
            result.put("from", String.valueOf(message.getFrom()));
            result.put("errorCode", message.getErrorCode() != null ? message.getErrorCode().toString() : null);
            result.put("errorMessage", message.getErrorMessage());
            return result;
        } catch (ApiException e) {
            String details = String.format("Twilio ApiException: status=%d, code=%s, message=%s, moreInfo=%s",
                    e.getStatusCode(),
                    e.getCode(),
                    e.getMessage(),
                    e.getMoreInfo());
            throw new RuntimeException(details, e);
        }
    }
}