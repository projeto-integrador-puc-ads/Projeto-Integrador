package br.pucgo.ads.projetointegrador.carehub.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import br.pucgo.ads.projetointegrador.carehub.entity.Avaliacao;
import br.pucgo.ads.projetointegrador.carehub.entity.Cuidador;

import java.util.List;

@Repository
public interface AvaliacaoRepository extends JpaRepository<Avaliacao, Long> {
    List<Avaliacao> findByCuidadorOrderByDataAvaliacaoDesc(Cuidador cuidador);
    List<Avaliacao> findByCuidadorIdOrderByDataAvaliacaoDesc(Long cuidadorId);
    
    // Conta avaliações de um cuidador
    long countByCuidadorId(Long cuidadorId);
    
    // Verifica se cliente já avaliou este cuidador
    @Query("SELECT CASE WHEN COUNT(a) > 0 THEN true ELSE false END " +
           "FROM Avaliacao a WHERE a.cliente.id = :clienteId AND a.cuidador.id = :cuidadorId")
    boolean existsByClienteIdAndCuidadorId(@Param("clienteId") Long clienteId, 
                                           @Param("cuidadorId") Long cuidadorId);
    
    // Verifica se teve agendamento CONCLUIDO entre cliente e cuidador
    @Query("SELECT CASE WHEN COUNT(ag) > 0 THEN true ELSE false END " +
           "FROM Agendamento ag WHERE ag.cliente.id = :clienteId " +
           "AND ag.cuidador.id = :cuidadorId " +
           "AND ag.status = 'CONCLUIDO'")
    boolean existsAgendamentoConcluido(@Param("clienteId") Long clienteId, 
                                       @Param("cuidadorId") Long cuidadorId);

    @Query("SELECT a FROM Avaliacao a WHERE a.agendamento.id = :agendamentoId")
    Avaliacao findByAgendamentoId(@Param("agendamentoId") Long agendamentoId);

    @Query("SELECT CASE WHEN COUNT(a) > 0 THEN true ELSE false END FROM Avaliacao a WHERE a.agendamento.id = :agendamentoId")
    boolean existsByAgendamentoId(@Param("agendamentoId") Long agendamentoId);
}
