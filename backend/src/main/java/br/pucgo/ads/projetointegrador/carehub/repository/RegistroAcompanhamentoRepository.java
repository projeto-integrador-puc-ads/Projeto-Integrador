package br.pucgo.ads.projetointegrador.carehub.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import br.pucgo.ads.projetointegrador.carehub.entity.RegistroAcompanhamento;

import java.util.List;

@Repository
public interface RegistroAcompanhamentoRepository extends JpaRepository<RegistroAcompanhamento, Long> {
    
    List<RegistroAcompanhamento> findByClienteIdOrderByDataHoraRegistroDesc(Long clienteId);
    
    List<RegistroAcompanhamento> findByCuidadorIdOrderByDataHoraRegistroDesc(Long cuidadorId);
    
    List<RegistroAcompanhamento> findByAgendamentoIdOrderByDataHoraRegistroDesc(Long agendamentoId);
    
    List<RegistroAcompanhamento> findByAgendamentoId(Long agendamentoId);
    
    boolean existsByAgendamentoId(Long agendamentoId);
}
