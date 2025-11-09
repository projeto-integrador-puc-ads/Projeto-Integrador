package br.pucgo.ads.projetointegrador.carehub.entity;

/**
 * Tipos de atendimento disponíveis no CareHub
 */
public enum TipoAtendimento {
    /**
     * Atendimento realizado na residência do cliente
     */
    DOMICILIO("Atendimento Domiciliar"),
    
    /**
     * Acompanhamento regular do cliente
     */
    ACOMPANHAMENTO("Acompanhamento"),
    
    /**
     * Atendimento presencial em clínica/hospital
     */
    PRESENCIAL("Atendimento Presencial"),
    
    /**
     * Atendimento de emergência
     */
    EMERGENCIA("Emergência");

    private final String descricao;

    TipoAtendimento(String descricao) {
        this.descricao = descricao;
    }

    public String getDescricao() {
        return descricao;
    }
}
