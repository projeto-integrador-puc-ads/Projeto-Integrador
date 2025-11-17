package br.pucgo.ads.projetointegrador.sabordafamilia.repository;

import br.pucgo.ads.projetointegrador.sabordafamilia.entity.Comentario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query; // <-- IMPORT
import java.util.List;

public interface ComentarioRepository extends JpaRepository<Comentario, Long> {
    
    // Força o carregamento do 'usuario' junto com os comentários
    @Query("SELECT c FROM Comentario c JOIN FETCH c.usuario WHERE c.receita.id = :receitaId")
    List<Comentario> findByReceitaIdWithUsuario(Long receitaId);
}