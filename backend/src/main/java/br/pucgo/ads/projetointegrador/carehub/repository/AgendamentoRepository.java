package br.pucgo.ads.projetointegrador.carehub.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import br.pucgo.ads.projetointegrador.carehub.entity.Agendamento;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AgendamentoRepository extends JpaRepository<Agendamento, Long> {
    
    List<Agendamento> findByCuidadorIdOrderByDataHoraInicioDesc(Long cuidadorId);
    
    List<Agendamento> findByClienteIdOrderByDataHoraInicioDesc(Long clienteId);
    
    @Query("SELECT a FROM Agendamento a WHERE a.cuidador.id = :cuidadorId " +
           "AND a.dataHoraInicio >= :inicio AND a.dataHoraFim <= :fim " +
           "ORDER BY a.dataHoraInicio")
    List<Agendamento> findByCuidadorAndPeriodo(Long cuidadorId, LocalDateTime inicio, LocalDateTime fim);
    
    @Query("SELECT a FROM Agendamento a WHERE a.cliente.id = :clienteId " +
           "AND a.dataHoraInicio >= :inicio AND a.dataHoraFim <= :fim " +
           "ORDER BY a.dataHoraInicio")
    List<Agendamento> findByClienteAndPeriodo(Long clienteId, LocalDateTime inicio, LocalDateTime fim);
    
    List<Agendamento> findByStatusOrderByDataHoraInicioDesc(Agendamento.StatusAgendamento status);
}
