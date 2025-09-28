package br.pucgo.ads.projetointegrador.plataforma.repository;

import br.pucgo.ads.projetointegrador.plataforma.entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    
    /**
     * Busca usuário por email
     */
    Optional<Usuario> findByEmail(String email);
    
    /**
     * Busca usuários ativos
     */
    List<Usuario> findByAtivoTrue();
    
    /**
     * Busca usuários por tipo
     */
    List<Usuario> findByTipoUsuario(Usuario.TipoUsuario tipoUsuario);
    
    /**
     * Busca usuários por nome (contendo)
     */
    List<Usuario> findByNomeContainingIgnoreCase(String nome);
    
    /**
     * Verifica se existe usuário com email (excluindo um ID específico)
     */
    @Query("SELECT CASE WHEN COUNT(u) > 0 THEN true ELSE false END FROM Usuario u WHERE u.email = :email AND u.id != :id")
    boolean existsByEmailAndIdNot(@Param("email") String email, @Param("id") Long id);
    
    /**
     * Busca usuários ativos por tipo
     */
    List<Usuario> findByAtivoTrueAndTipoUsuario(Usuario.TipoUsuario tipoUsuario);
}