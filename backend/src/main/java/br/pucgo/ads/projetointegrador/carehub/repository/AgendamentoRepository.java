package br.pucgo.ads.projetointegrador.carehub.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import br.pucgo.ads.projetointegrador.carehub.entity.Agendamento;
import br.pucgo.ads.projetointegrador.carehub.entity.Agendamento.StatusAgendamento;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AgendamentoRepository extends JpaRepository<Agendamento, Long> {
    
    List<Agendamento> findByCuidadorIdOrderByDataHoraInicioDesc(Long cuidadorId);
    
    List<Agendamento> findByClienteIdOrderByDataHoraInicioDesc(Long clienteId);
    
    // Ordenação por data de solicitação (quando o idoso criou o agendamento)
    List<Agendamento> findByCuidadorIdOrderByDataSolicitacaoDesc(Long cuidadorId);
    
    List<Agendamento> findByClienteIdOrderByDataSolicitacaoDesc(Long clienteId);
    
       @Query("SELECT a FROM Agendamento a WHERE a.cuidador.id = :cuidadorId " +
           "AND a.dataHoraInicio >= :inicio AND a.dataHoraFim <= :fim " +
           "ORDER BY a.dataHoraInicio")
    List<Agendamento> findByCuidadorAndPeriodo(Long cuidadorId, LocalDateTime inicio, LocalDateTime fim);
    
       @Query("SELECT a FROM Agendamento a WHERE a.cliente.id = :clienteId " +
           "AND a.dataHoraInicio >= :inicio AND a.dataHoraFim <= :fim " +
           "ORDER BY a.dataHoraInicio")
    List<Agendamento> findByClienteAndPeriodo(Long clienteId, LocalDateTime inicio, LocalDateTime fim);

       List<Agendamento> findByStatusOrderByDataHoraInicioDesc(StatusAgendamento status);
    
    @Query("SELECT a FROM Agendamento a WHERE (a.cliente.id = :userId OR a.cuidador.id = :userId) " +
           "AND a.dataHoraInicio >= :inicio AND a.dataHoraInicio <= :fim " +
           "AND a.status IN ('AGENDADO', 'CONFIRMADO', 'EM_ANDAMENTO') " +
           "ORDER BY a.dataHoraInicio ASC")
    List<Agendamento> findProximosAgendamentos(Long userId, LocalDateTime inicio, LocalDateTime fim);
    
    @Query("SELECT CASE WHEN COUNT(a) > 0 THEN true ELSE false END " +
           "FROM Agendamento a WHERE a.cuidador.id = :cuidadorId " +
           "AND a.cliente.id = :clienteId " +
           "AND a.dataHoraInicio >= :inicio " +
           "AND a.dataHoraInicio < :fim " +
           "AND a.status IN ('CONFIRMADO', 'EM_ANDAMENTO')")
    boolean existsAgendamentoAtivoHoje(Long cuidadorId, Long clienteId, LocalDateTime inicio, LocalDateTime fim);

    @Query("SELECT CASE WHEN COUNT(a) > 0 THEN true ELSE false END " +
           "FROM Agendamento a WHERE (a.cuidador.id = :user1Id AND a.cliente.id = :user2Id) OR (a.cuidador.id = :user2Id AND a.cliente.id = :user1Id)")
    boolean existsBetweenUsers(Long user1Id, Long user2Id);

    // Buscar agendamentos CONCLUIDOS do cliente que ainda não foram avaliados
    @Query("SELECT a FROM Agendamento a " +
           "WHERE a.cliente.id = :clienteId " +
           "AND a.status = 'CONCLUIDO' " +
           "AND NOT EXISTS (SELECT av FROM Avaliacao av WHERE av.agendamento.id = a.id) " +
           "ORDER BY a.dataHoraFim DESC")
    List<Agendamento> findAgendamentosPendentesAvaliacaoByClienteId(Long clienteId);
    
    // Contar avaliações pendentes do cliente
    @Query("SELECT COUNT(a) FROM Agendamento a " +
           "WHERE a.cliente.id = :clienteId " +
           "AND a.status = 'CONCLUIDO' " +
           "AND NOT EXISTS (SELECT av FROM Avaliacao av WHERE av.agendamento.id = a.id)")
    long countAvaliacoesPendentesByClienteId(Long clienteId);
    
    // Contar agendamentos PENDENTES aguardando confirmação do cuidador
    @Query("SELECT COUNT(a) FROM Agendamento a WHERE a.cuidador.id = :cuidadorId AND a.status = 'PENDENTE'")
    long countPendentesByCuidadorId(Long cuidadorId);
    
    // Contar agendamentos REAGENDADOS (contrapropostas) aguardando resposta do cliente
    @Query("SELECT COUNT(a) FROM Agendamento a WHERE a.cliente.id = :clienteId AND a.status = 'REAGENDADO'")
    long countReagendadosByClienteId(Long clienteId);
}
