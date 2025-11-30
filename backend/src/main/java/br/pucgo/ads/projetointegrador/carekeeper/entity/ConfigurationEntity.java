package br.pucgo.ads.projetointegrador.carekeeper.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/*  
    * Representa a configuração personalizada de um usuário para o sistema CareKeeper.
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

    public ConfigurationEntity(Long userId, String configJson) {
        this.userId = userId;
        this.configJson = configJson;
    }
}
