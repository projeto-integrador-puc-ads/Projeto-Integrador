package br.pucgo.ads.projetointegrador.plataforma.entity;

public enum RoleType {
    ROLE_USER,
    ROLE_ADMIN,
    IDOSO,
    CUIDADOR,
    FAMILIAR,
    PROFISSIONAL_SAUDE,
    // CareHub roles
    CAREHUB_ADMIN,
    CAREHUB_CUIDADOR,
    CAREHUB_CLIENTE;
    
    @Override
    public String toString() {
        return name();
    }
}