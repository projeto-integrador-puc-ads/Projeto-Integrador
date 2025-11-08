package br.pucgo.ads.projetointegrador.carehub.controller;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import br.pucgo.ads.projetointegrador.carehub.dto.mensagem.ContatoDTO;
import br.pucgo.ads.projetointegrador.carehub.dto.mensagem.MensagemRequestDTO;
import br.pucgo.ads.projetointegrador.carehub.dto.mensagem.MensagemResponseDTO;
import br.pucgo.ads.projetointegrador.carehub.service.MensagemService;

import java.util.List;

@RestController
@RequestMapping("/api/carehub/mensagens")
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

    @GetMapping
    public ResponseEntity<List<MensagemResponseDTO>> listarMensagens(
            @RequestHeader("X-User-Id") Long usuarioId
    ) {
        List<MensagemResponseDTO> mensagens = mensagemService.listarMensagens(usuarioId);
        return ResponseEntity.ok(mensagens);
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

    @GetMapping("/contador-nao-lidas")
    public ResponseEntity<Long> contarNaoLidas(@RequestHeader("X-User-Id") Long usuarioId) {
        long count = mensagemService.contarMensagensNaoLidas(usuarioId);
        return ResponseEntity.ok(count);
    }

    @GetMapping("/contatos")
    public ResponseEntity<List<ContatoDTO>> listarContatos(@RequestHeader("X-User-Id") Long usuarioId) {
        List<ContatoDTO> contatos = mensagemService.listarContatos(usuarioId);
        return ResponseEntity.ok(contatos);
    }

    @PutMapping("/marcar-lidas/{remetenteId}")
    public ResponseEntity<Void> marcarConversaComoLida(
            @PathVariable Long remetenteId,
            @RequestHeader("X-User-Id") Long usuarioId
    ) {
        mensagemService.marcarConversaComoLida(usuarioId, remetenteId);
        return ResponseEntity.noContent().build();
    }
}
