package br.pucgo.ads.projetointegrador.carehub.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "message_media")
public class MessageMedia {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "mensagem_id", nullable = false)
    private Long mensagemId;

    @Column(name = "storage_key", nullable = false)
    private String storageKey;

    @Column(name = "media_url", nullable = false)
    private String mediaUrl;

    @Column(name = "content_type")
    private String contentType;

    @Column(name = "size_bytes")
    private Long sizeBytes;

    @Lob
    @Column(name = "data")
    private byte[] data;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    public MessageMedia() {}

    // getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getMensagemId() { return mensagemId; }
    public void setMensagemId(Long mensagemId) { this.mensagemId = mensagemId; }
    public String getStorageKey() { return storageKey; }
    public void setStorageKey(String storageKey) { this.storageKey = storageKey; }
    public String getMediaUrl() { return mediaUrl; }
    public void setMediaUrl(String mediaUrl) { this.mediaUrl = mediaUrl; }
    public String getContentType() { return contentType; }
    public void setContentType(String contentType) { this.contentType = contentType; }
    public Long getSizeBytes() { return sizeBytes; }
    public void setSizeBytes(Long sizeBytes) { this.sizeBytes = sizeBytes; }
    public byte[] getData() { return data; }
    public void setData(byte[] data) { this.data = data; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
