package br.pucgo.ads.projetointegrador.listaCompras.repository;


import br.pucgo.ads.projetointegrador.listaCompras.entity.Lista;
import br.pucgo.ads.projetointegrador.listaCompras.entity.Lista.StatusLista;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ListaRepository extends JpaRepository<Lista,Long> {

    // Buscar listas por usuário
    List<Lista> findByUsuario_Id(Long usuarioId);

    // Buscar listas por usuário e status
    List<Lista> findByUsuario_IdAndStatus(Long usuarioId, StatusLista status);

    // Buscar listas do usuário por status, ordenadas pela criação (campo REAL da entidade)
    List<Lista> findByUsuario_IdAndStatusOrderByCreatedAtDesc(Long usuarioId, StatusLista status);

    // Buscar listas template
    List<Lista> findByTemplateTrue();

    // Buscar listas não-template (listas normais do usuário)
    List<Lista> findByUsuario_IdAndTemplateFalse(Long usuarioId);
    List<Lista> findByUsuario_IdAndTemplateFalseOrderByCreatedAtDesc(Long usuarioId);

    // Buscar templates disponíveis
    List<Lista> findByTemplateTrueOrderByTituloAsc();

    // Buscar listas do usuário ordenadas por data de criação
    List<Lista> findByUsuario_IdOrderByCreatedAtDesc(Long usuarioId);

    // Verificar se existe lista com mesmo título para o usuário
    boolean existsByUsuario_IdAndTituloIgnoreCase(Long usuarioId, String titulo);

    List<Lista> findByTemplateTrueAndPatologiaIsNullOrderByTituloAsc();

    @Query("""
        select l
        from Lista l
        where l.template = true
          and (l.patologia is null or l.patologia.id in :patologiaIds)
        order by l.titulo asc
    """)
    List<Lista> buscarTemplatesPorPatologiasOuGenericos(@Param("patologiaIds") List<Long> patologiaIds);


}

