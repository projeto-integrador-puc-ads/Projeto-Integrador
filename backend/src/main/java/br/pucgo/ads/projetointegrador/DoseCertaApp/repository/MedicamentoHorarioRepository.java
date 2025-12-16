package br.pucgo.ads.projetointegrador.DoseCertaApp.repository;

import br.pucgo.ads.projetointegrador.DoseCertaApp.model.MedicamentoHorario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MedicamentoHorarioRepository extends JpaRepository<MedicamentoHorario, Long> {

    List<MedicamentoHorario> findByMedicamentoIdOrderByHorarioAsc(Long medicamentoId);

    void deleteByMedicamentoId(Long medicamentoId);

    @Query("""
        SELECT h
        FROM MedicamentoHorario h
        WHERE h.tomadoHoje = false
          AND h.notificado = false
    """)
    List<MedicamentoHorario> findAllAbertos();
}
