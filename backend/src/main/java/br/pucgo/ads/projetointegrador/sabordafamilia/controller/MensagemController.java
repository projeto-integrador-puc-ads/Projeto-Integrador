package br.pucgo.ads.projetointegrador.sabordafamilia.controller;

import br.pucgo.ads.projetointegrador.sabordafamilia.dto.ConversaSummaryDTO;
import br.pucgo.ads.projetointegrador.sabordafamilia.entity.Mensagem;
import br.pucgo.ads.projetointegrador.sabordafamilia.service.MensagemService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map; // <-- NECESSÁRIO

@RestController
@RequestMapping("/api/sabordafamilia/mensagens")
@CrossOrigin
public class MensagemController {

    private final MensagemService mensagemService;

    public MensagemController(MensagemService mensagemService) {
        this.mensagemService = mensagemService;
    }

    // Endpoint 1: Para a ChatListPage (lista de resumos)
    @GetMapping("/conversas")
    public ResponseEntity<List<ConversaSummaryDTO>> getConversas(@RequestHeader("X-User-Id") Long userId) {
        List<ConversaSummaryDTO> conversas = mensagemService.listarConversas(userId);
        return ResponseEntity.ok(conversas);
    }

    // Endpoint 2: Para a ChatDetailPage (buscar histórico)
    @GetMapping("/{contactId}")
    public ResponseEntity<List<Mensagem>> getHistoricoConversa(
            @RequestHeader("X-User-Id") Long userId,
            @PathVariable Long contactId) {
        
        List<Mensagem> historico = mensagemService.getConversa(userId, contactId);
        return ResponseEntity.ok(historico);
    }

    // Endpoint 3: Para a ChatDetailPage (enviar mensagem)
    @PostMapping("/{contactId}")
    public ResponseEntity<Mensagem> enviarMensagem(
            @RequestHeader("X-User-Id") Long userId, // Remetente
            @PathVariable Long contactId, // Destinatário
            @RequestBody Map<String, String> payload) {
        
        String conteudo = payload.get("conteudo");
        if (conteudo == null || conteudo.trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        Mensagem msgSalva = mensagemService.enviarMensagem(userId, contactId, conteudo);
        return ResponseEntity.ok(msgSalva);
    }
}