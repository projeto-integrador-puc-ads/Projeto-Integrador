package br.pucgo.ads.projetointegrador.carehub.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.core.io.Resource;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;

import java.util.Map;
import java.util.List;

import br.pucgo.ads.projetointegrador.carehub.dto.mensagem.ContatoDTO;
import br.pucgo.ads.projetointegrador.carehub.dto.mensagem.MensagemRequestDTO;
import br.pucgo.ads.projetointegrador.carehub.dto.mensagem.MensagemResponseDTO;
import br.pucgo.ads.projetointegrador.carehub.service.MensagemService;

@RestController
@RequestMapping("/api/carehub/mensagens")
public class MensagemController {

    @Autowired
    private MensagemService mensagemService;
    @Autowired
    private br.pucgo.ads.projetointegrador.carehub.repository.MensagemRepository mensagemRepository;
    @Autowired
    private br.pucgo.ads.projetointegrador.carehub.repository.MessageMediaRepository messageMediaRepository;

    @PostMapping
    public ResponseEntity<MensagemResponseDTO> enviarMensagem(
            @RequestHeader("X-User-Id") Long remetenteId,
            @RequestBody Map<String, Object> dtoMap
    ) {
        // Construir DTO manualmente para evitar carregar a classe durante a introspecção
        Long destinatarioId = dtoMap.get("destinatarioId") == null ? null : Long.valueOf(dtoMap.get("destinatarioId").toString());
        String conteudo = dtoMap.get("conteudo") == null ? null : dtoMap.get("conteudo").toString();
        MensagemRequestDTO dto = new MensagemRequestDTO(destinatarioId, conteudo, null, null);
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

    @PostMapping("/media")
    public ResponseEntity<MensagemResponseDTO> enviarMensagemComMedia(
            @RequestHeader("X-User-Id") Long remetenteId,
            @RequestParam("destinatarioId") Long destinatarioId,
            @RequestParam("file") MultipartFile file
    ) throws Exception {
        // read bytes and store in DB as blob
        byte[] data = file.getBytes();
        String storageKey = java.util.UUID.randomUUID().toString();
        String mediaUrl = "/api/carehub/mensagens/media/" + storageKey;

        // create message using existing service (persist message with mediaUrl, no text content for audio)
        MensagemResponseDTO mensagem = mensagemService.enviarMensagem(remetenteId, new br.pucgo.ads.projetointegrador.carehub.dto.mensagem.MensagemRequestDTO(destinatarioId, null, mediaUrl, file.getContentType()));

        // Persist media blob in DB
        try {
            br.pucgo.ads.projetointegrador.carehub.entity.MessageMedia mm = new br.pucgo.ads.projetointegrador.carehub.entity.MessageMedia();
            mm.setMensagemId(mensagem.getId());
            mm.setStorageKey(storageKey);
            mm.setMediaUrl(mediaUrl);
            mm.setContentType(file.getContentType());
            mm.setSizeBytes(file.getSize());
            mm.setData(data);
            messageMediaRepository.save(mm);
        } catch (Exception ex) {
            System.err.println("Warning: failed to save media blob: " + ex.getMessage());
        }

        return ResponseEntity.ok(mensagem);
    }

    @GetMapping("/media/{filename:.+}")
    @org.springframework.transaction.annotation.Transactional(readOnly = true)
    public ResponseEntity<Resource> serveMedia(@RequestHeader("X-User-Id") Long usuarioId, @PathVariable String filename) throws Exception {
        // Look up media in DB by storageKey
        br.pucgo.ads.projetointegrador.carehub.entity.MessageMedia mm = messageMediaRepository.findByStorageKey(filename);
        if (mm == null) {
            return ResponseEntity.notFound().build();
        }

        // Verify that the requesting user is either remetente or destinatario of the message that references this media
        String mediaUrl = "/api/carehub/mensagens/media/" + filename;
        var maybe = mensagemRepository.findByMediaUrl(mediaUrl);
        if (maybe.isEmpty()) {
            return ResponseEntity.status(403).build();
        }
        var mensagem = maybe.get();
        mensagem = java.util.Objects.requireNonNull(mensagem);
        Long remetenteId = mensagem.getRemetente() == null ? null : mensagem.getRemetente().getId();
        Long destinatarioId = mensagem.getDestinatario() == null ? null : mensagem.getDestinatario().getId();
        if (!usuarioId.equals(remetenteId) && !usuarioId.equals(destinatarioId)) {
            return ResponseEntity.status(403).build();
        }

        // Garantir que o contentType seja não-nulo para satisfazer o analisador de null-safety
        String rawContentType = mm.getContentType();
        if (rawContentType == null) rawContentType = "application/octet-stream";
        final String contentType = java.util.Objects.requireNonNull(rawContentType);

        // garantir não-nulidade dos bytes antes de construir o resource
        byte[] dataBytes = java.util.Objects.requireNonNull(mm.getData());
        InputStreamResource resource = new InputStreamResource(new java.io.ByteArrayInputStream(dataBytes));
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + filename + "\"")
                .contentType(MediaType.parseMediaType(contentType))
                .body(resource);
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
