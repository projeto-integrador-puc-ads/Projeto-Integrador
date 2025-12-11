package br.pucgo.ads.projetointegrador.carekeeper.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Representa a configuração personalizada de um usuário para o sistema CareKeeper.
 * Inclui agora o campo "alert" para indicar se o usuário está em estado de alerta ativo.
 */
@Entity
@Table(name = "user_configuration")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ConfigurationEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false, unique = true)
    private Long userId;

    @Column(name = "config_json", columnDefinition = "TEXT")
    private String configJson;

    @Column(name = "alert", nullable = false)
    private boolean alert = false; 

    public ConfigurationEntity(Long userId, String configJson) {
        this.userId = userId;
        this.configJson = configJson;
        this.alert = false;
    }
}
