package br.pucgo.ads.projetointegrador.sabordafamilia.repository;

import br.pucgo.ads.projetointegrador.sabordafamilia.entity.Receita;
import br.pucgo.ads.projetointegrador.sabordafamilia.entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.Set;

public interface ReceitaRepository extends JpaRepository<Receita, Long> {

    @Query("SELECT r FROM Receita r " +
           "LEFT JOIN FETCH r.autor " +
           "LEFT JOIN FETCH r.midias " +
           "LEFT JOIN FETCH r.restricoes " +
           "LEFT JOIN FETCH r.usuariosCurtiram " +
           "LEFT JOIN FETCH r.usuariosFavoritaram " +
           "WHERE r.id = :id")
    Optional<Receita> findByIdWithCollections(@Param("id") Long id);

    @Query("SELECT r FROM Receita r " +
           "LEFT JOIN FETCH r.autor " +
           "LEFT JOIN FETCH r.midias " +
           "LEFT JOIN FETCH r.restricoes " +
           "LEFT JOIN FETCH r.usuariosCurtiram ")
    List<Receita> findAllWithAutorMidiasAndCurtidas();

    List<Receita> findByAutorId(Long autorId);
    
    // Esta query busca todas as receitas (com seus dados)
    // onde o autor (r.autor) está EM (IN) uma lista de autores que passamos.
    @Query("SELECT r FROM Receita r " +
           "LEFT JOIN FETCH r.autor " +
           "LEFT JOIN FETCH r.midias " +
           "LEFT JOIN FETCH r.restricoes " +
           "LEFT JOIN FETCH r.usuariosCurtiram " +
           "WHERE r.autor IN :autores")
    List<Receita> findReceitasByAutores(@Param("autores") Set<Usuario> autores);
}