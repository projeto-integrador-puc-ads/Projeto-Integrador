package br.pucgo.ads.projetointegrador.carehub.controller;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import br.pucgo.ads.projetointegrador.carehub.dto.mensagem.MensagemRequestDTO;
import br.pucgo.ads.projetointegrador.carehub.dto.mensagem.MensagemResponseDTO;
import br.pucgo.ads.projetointegrador.carehub.service.MensagemService;

import java.util.List;

@RestController
@RequestMapping("/api/carehub/mensagens")
@CrossOrigin(origins = "*")
public class MensagemController {

    @Autowired
    private MensagemService mensagemService;

    @PostMapping
    public ResponseEntity<MensagemResponseDTO> enviarMensagem(
            @RequestHeader("X-User-Id") Long remetenteId,
            @Valid @RequestBody MensagemRequestDTO dto
    ) {
        MensagemResponseDTO mensagem = mensagemService.enviarMensagem(remetenteId, dto);
        return ResponseEntity.ok(mensagem);
    }

    @GetMapping("/conversa/{usuarioId}")
    public ResponseEntity<List<MensagemResponseDTO>> buscarConversa(
            @RequestHeader("X-User-Id") Long usuarioAutenticadoId,
            @PathVariable Long usuarioId
    ) {
        List<MensagemResponseDTO> mensagens = mensagemService.buscarConversa(usuarioAutenticadoId, usuarioId);
        return ResponseEntity.ok(mensagens);
    }

    @GetMapping("/nao-lidas")
    public ResponseEntity<List<MensagemResponseDTO>> buscarNaoLidas(
            @RequestHeader("X-User-Id") Long destinatarioId
    ) {
        List<MensagemResponseDTO> mensagens = mensagemService.buscarMensagensNaoLidas(destinatarioId);
        return ResponseEntity.ok(mensagens);
    }

    @PutMapping("/{id}/lida")
    public ResponseEntity<Void> marcarComoLida(@PathVariable Long id) {
        mensagemService.marcarComoLida(id);
        return ResponseEntity.noContent().build();
    }
}
