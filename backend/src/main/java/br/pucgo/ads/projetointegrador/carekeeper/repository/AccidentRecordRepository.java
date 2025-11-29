package br.pucgo.ads.projetointegrador.carekeeper.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import br.pucgo.ads.projetointegrador.carekeeper.entity.AccidentRecordEntity;

import java.util.List;

@Repository
public interface AccidentRecordRepository extends JpaRepository<AccidentRecordEntity, Long> {

    List<AccidentRecordEntity> findByUserId(Long userId);

    @Query("SELECT COUNT(a) FROM AccidentRecordEntity a WHERE a.userId = :userId")
    Long countByUserId(@Param("userId") Long userId);

    @Query("SELECT COUNT(a) FROM AccidentRecordEntity a WHERE a.userId = :userId AND a.detectedAt BETWEEN :start AND :end")
    Long countByUserIdAndDetectedAtBetween(@Param("userId") Long userId,
                                           @Param("start") Long start,
                                           @Param("end") Long end);

    @Query("SELECT COUNT(a) FROM AccidentRecordEntity a WHERE a.detectedAt BETWEEN :start AND :end")
    Long countByDetectedAtBetween(@Param("start") Long start,
                                  @Param("end") Long end);
}
