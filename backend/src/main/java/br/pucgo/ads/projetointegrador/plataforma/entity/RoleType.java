package br.pucgo.ads.projetointegrador.plataforma.entity;

public enum RoleType {
    ROLE_USER,
    ROLE_ADMIN,
    IDOSO,
    CUIDADOR,
    FAMILIAR,
    PROFISSIONAL_SAUDE;
    
    @Override
    public String toString() {
        return name();
    }
}