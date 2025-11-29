package com.example.carekeeper.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Entity
@Table(name = "user_configuration")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ConfigurationEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false, unique = true, columnDefinition = "VARCHAR(36)")
    private UUID userId;

    @Column(name = "config_json", columnDefinition = "TEXT")
    private String configJson;

    public ConfigurationEntity(UUID userId, String configJson) {
        this.userId = userId;
        this.configJson = configJson;
    }
}
