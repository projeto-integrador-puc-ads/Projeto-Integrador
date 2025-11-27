package br.pucgo.ads.projetointegrador.carehub.repository;

import java.math.BigDecimal;
import java.time.Instant;

public interface CuidadorProjection {
    Long getId();
    String getName();
    String getEmail();
    String getPhone();
    String getExperiencia();
    String getCidade();
    String getEstado();
    Boolean getDisponibilidade();
    BigDecimal getTaxaHora();
    BigDecimal getAvaliacaoMedia();
    Integer getTotalAvaliacoes();
    String getBiografia();
    String getFotoPerfil();
    Instant getCreatedAt();
    Boolean getAtivo();
}
