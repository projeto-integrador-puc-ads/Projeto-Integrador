package br.pucgo.ads.projetointegrador.carehub.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import br.pucgo.ads.projetointegrador.carehub.entity.Administrador;

@Repository
public interface AdministradorRepository extends JpaRepository<Administrador, Long> {
}
