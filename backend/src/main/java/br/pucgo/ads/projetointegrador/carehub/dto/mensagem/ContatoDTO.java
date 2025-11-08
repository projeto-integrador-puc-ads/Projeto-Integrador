package br.pucgo.ads.projetointegrador.carehub.dto.mensagem;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ContatoDTO {
    private Long id;
    private String nome;
    private String perfil; // "CLIENTE" ou "CUIDADOR"
    private String email;
    private Long mensagensNaoLidas; // Contador de mensagens não lidas deste contato
    private String ultimaMensagem; // Prévia da última mensagem
    private LocalDateTime dataUltimaMensagem; // Data/hora da última mensagem
}
