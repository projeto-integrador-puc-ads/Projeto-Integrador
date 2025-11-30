package br.pucgo.ads.projetointegrador.carekeeper.entity;

import br.pucgo.ads.projetointegrador.carekeeper.enums.AccidentType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Representa um registro de acidente detectado pelo sistema CareKeeper.
*/
@Entity
@Table(name = "accident_record")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AccidentRecordEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "sensor_json", columnDefinition = "TEXT")
    private String sensorJson;

    @Enumerated(EnumType.STRING)
    @Column(name = "accident_type", columnDefinition = "VARCHAR(64)")
    private AccidentType accidentType;

    @Column(name = "detected_at")
    private Long detectedAt;

    public AccidentRecordEntity(Long userId, String sensorJson, AccidentType accidentType, Long detectedAt) {
        this.userId = userId;
        this.sensorJson = sensorJson;
        this.accidentType = accidentType;
        this.detectedAt = detectedAt;
    }
}
