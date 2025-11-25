package br.pucgo.ads.projetointegrador.diario_saude.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import br.pucgo.ads.projetointegrador.diario_saude.entity.PrescricaoMedicaEntity;

public interface PrescricaoMedicaRepository extends JpaRepository<PrescricaoMedicaEntity, Long> {

    @Query("""
        SELECT p FROM PrescricaoMedicaEntity p
        LEFT JOIN FETCH p.prescricoesMedicamentos pm
        LEFT JOIN FETCH p.prescricoesExames pe
        LEFT JOIN FETCH p.exerciciosRecomendados er
        WHERE p.usuario.idUsuario = :idUsuario
    """)
    List<PrescricaoMedicaEntity> findByUsuario(Long idUsuario);

    @Query("""
        SELECT p FROM PrescricaoMedicaEntity p
        LEFT JOIN FETCH p.exerciciosRecomendados er
        WHERE p.id_prescricao = :prescricaoId
    """)
    Optional<PrescricaoMedicaEntity> findByIdWithExercicios(Long prescricaoId);
}