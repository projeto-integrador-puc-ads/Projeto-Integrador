package br.pucgo.ads.projetointegrador.diario_saude.dto;

import br.pucgo.ads.projetointegrador.diario_saude.entity.ExercicioRecomendadoEntity;
// import org.springframework.beans.BeanUtils; 

public class ExercicioRecomendadoDTO {

    private Long id; // Adicionando ID para mapeamento
    private Long idPrescricao;     // id da prescrição médica
    private String descricao;      // texto da recomendação

    public ExercicioRecomendadoDTO() {}

    public ExercicioRecomendadoDTO(ExercicioRecomendadoEntity entity) {
        // Assume-se que a entidade tem um método getId()
        this.id = entity.getId(); 
        
        // Assume-se que a entidade tem um método getDescricao()
        this.descricao = entity.getDescricao();
        
        // Mapeia o ID da Prescrição, assumindo que a relação é PrescricaoMedicaEntity
        if (entity.getPrescricaoMedica() != null) {
            this.idPrescricao = entity.getPrescricaoMedica().getId_prescricao();
        }
    }

    // --- Getters e Setters (Mantidos e Adicionado o do ID) ---
    
    // Getter para ID
    public Long getId() {
        return id;
    }

    // Setter para ID
    public void setId(Long id) {
        this.id = id;
    }

    public Long getIdPrescricao() {
        return idPrescricao;
    }

    public void setIdPrescricao(Long idPrescricao) {
        this.idPrescricao = idPrescricao;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }
}