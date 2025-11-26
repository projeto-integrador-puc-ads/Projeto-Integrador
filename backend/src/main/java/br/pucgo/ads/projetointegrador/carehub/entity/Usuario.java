package br.pucgo.ads.projetointegrador.carehub.entity;

import br.pucgo.ads.projetointegrador.plataforma.entity.User;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.Set;
import jakarta.persistence.Transient;

/**
 * Compatibility bridge between legacy CareHub "Usuario" API and the new
 * plataforma.User model. This class adds the legacy getters/setters expected by
 * the carehub module (Portuguese names) while delegating storage to the
 * plataforma.User fields. All changes are local to the carehub package so the
 * plataforma module is not modified.
 */
public class Usuario extends User {

	// Legacy roles container used by carehub code. This is transient and kept
	// only for compatibility; real role/permission model lives in plataforma.
	// store legacy role names as strings to avoid duplicating enums
	private transient Set<String> rolesLegacy;

	// telefone <-> phone
	public String getTelefone() {
		return this.getPhone();
	}

	public void setTelefone(String telefone) {
		this.setPhone(telefone);
	}

	// ativo <-> status/deletedAt
	@Transient
	public Boolean getAtivo() {
		String s = this.getStatus();
		if (s != null) {
			return "ACTIVE".equalsIgnoreCase(s) || "ATIVO".equalsIgnoreCase(s) || "true".equalsIgnoreCase(s);
		}
		return this.getDeletedAt() == null;
	}

	@Transient
	public void setAtivo(Boolean ativo) {
		if (ativo == null) return;
		this.setStatus(ativo ? "ACTIVE" : "INACTIVE");
		if (!ativo) {
			this.setDeletedAt(OffsetDateTime.now(ZoneOffset.UTC));
		} else {
			this.setDeletedAt(null);
		}
	}

	// criadoEm <-> createdAt (OffsetDateTime) mapped to LocalDateTime
	public LocalDateTime getCriadoEm() {
		OffsetDateTime odt = this.getCreatedAt();
		return odt == null ? null : odt.toLocalDateTime();
	}

	public void setCriadoEm(LocalDateTime criadoEm) {
		if (criadoEm == null) {
			this.setCreatedAt(null);
		} else {
			this.setCreatedAt(criadoEm.atOffset(ZoneOffset.UTC));
		}
	}

	// Legacy roles API
	public Set<String> getRoles() {
		return rolesLegacy;
	}

	public void setRoles(Set<String> roles) {
		this.rolesLegacy = roles;
	}
}
