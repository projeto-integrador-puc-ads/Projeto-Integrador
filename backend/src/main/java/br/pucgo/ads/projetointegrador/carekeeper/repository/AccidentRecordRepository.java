package com.example.carekeeper.repository;

import com.example.carekeeper.model.AccidentRecordEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface AccidentRecordRepository extends JpaRepository<AccidentRecordEntity, Long> {

    List<AccidentRecordEntity> findByUserId(UUID userId);

    @Query("SELECT COUNT(a) FROM AccidentRecordEntity a WHERE a.userId = :userId")
    Long countByUserId(@Param("userId") UUID userId);

    @Query("SELECT COUNT(a) FROM AccidentRecordEntity a WHERE a.userId = :userId AND a.detectedAt BETWEEN :start AND :end")
    Long countByUserIdAndDetectedAtBetween(@Param("userId") UUID userId,
                                           @Param("start") Long start,
                                           @Param("end") Long end);

    @Query("SELECT COUNT(a) FROM AccidentRecordEntity a WHERE a.detectedAt BETWEEN :start AND :end")
    Long countByDetectedAtBetween(@Param("start") Long start,
                                  @Param("end") Long end);
}
