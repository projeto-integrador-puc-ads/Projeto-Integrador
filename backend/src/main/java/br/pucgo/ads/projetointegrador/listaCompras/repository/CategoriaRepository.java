package br.pucgo.ads.projetointegrador.listaCompras.repository;

import br.pucgo.ads.projetointegrador.listaCompras.entity.Categoria;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoriaRepository extends JpaRepository<Categoria, Long> {

    //Busca categoria por nome(evita duplicatas)
    Optional<Categoria> findByIgnoreCase(String nome);

    //busca por nome contendo
    List<Categoria> findByNomeIgnoreCase(String nome);
}
