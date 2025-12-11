package br.pucgo.ads.projetointegrador.remember.repository;

import br.pucgo.ads.projetointegrador.remember.dto.conquista.RankingProjection;
import br.pucgo.ads.projetointegrador.remember.entity.UsuarioConquista;
import br.pucgo.ads.projetointegrador.remember.key.UsuarioConquistaKey;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UsuarioConquistaRepository extends JpaRepository<UsuarioConquista, UsuarioConquistaKey> {

    List<UsuarioConquista> findByUsuarioConquistaKey_IdentificadorUsuarioOrderByDataObtencaoAsc(Long identificadorUsuario);

    @Query("SELECT u.name AS nomeUsuario, SUM(c.pontos) AS totalPontos " +
            "FROM UsuarioConquista uc " +
            "JOIN uc.usuario u " +
            "JOIN uc.conquista c " +
            "GROUP BY u.id, u.name " +
            "ORDER BY SUM(c.pontos) DESC")
    List<RankingProjection> buscarRankingGeral(Pageable pageable);
}