package br.pucgo.ads.projetointegrador.diario_saude.entity;

import org.springframework.beans.BeanUtils;
import br.pucgo.ads.projetointegrador.diario_saude.dto.ExercicioDTO;
import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "exercicio")
public class ExercicioEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id_exercicio;

    @Column(nullable = false)
    private String tipo_exercicio;

    private String tempo_ou_quantidade;

    private String observacoes;

    @OneToMany(mappedBy = "exercicio")
    private List<PrescricaoExercicioEntity> prescricoes;

    public ExercicioEntity() {}

    public ExercicioEntity(ExercicioDTO dto) {
        BeanUtils.copyProperties(dto, this);
    }

    public long getId_exercicio() {
        return id_exercicio;
    }

    public void setId_exercicio(long id_exercicio) {
        this.id_exercicio = id_exercicio;
    }

    public String getTipo_exercicio() {
        return tipo_exercicio;
    }

    public void setTipo_exercicio(String tipo_exercicio) {
        this.tipo_exercicio = tipo_exercicio;
    }

    public String getTempo_ou_quantidade() {
        return tempo_ou_quantidade;
    }

    public void setTempo_ou_quantidade(String tempo_ou_quantidade) {
        this.tempo_ou_quantidade = tempo_ou_quantidade;
    }

    public String getObservacoes() {
        return observacoes;
    }

    public void setObservacoes(String observacoes) {
        this.observacoes = observacoes;
    }

    public List<PrescricaoExercicioEntity> getPrescricoes() {
        return prescricoes;
    }

    public void setPrescricoes(List<PrescricaoExercicioEntity> prescricoes) {
        this.prescricoes = prescricoes;
    }
}
