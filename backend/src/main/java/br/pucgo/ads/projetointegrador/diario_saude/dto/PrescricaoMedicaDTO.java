package br.pucgo.ads.projetointegrador.diario_saude.dto;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.BeanUtils;

import br.pucgo.ads.projetointegrador.diario_saude.entity.PrescricaoMedicaEntity;

public class PrescricaoMedicaDTO {

    private long id_prescricao;
    private String data_prescricao;
    private String observacoes;

    private long id_medico;
    private String nomeMedico;

    private long id_usuario;

    private List<String> medicamentos;
    private List<String> exames;

    public PrescricaoMedicaDTO(PrescricaoMedicaEntity entity){

        BeanUtils.copyProperties(entity, this);

        // Nome do médico
        this.nomeMedico = entity.getMedico().getNome();

        // ID do médico
        this.id_medico = entity.getMedico().getId_medico();

        // ID do usuário
        this.id_usuario = entity.getUsuario().getId_usuario();

        // Lista de medicamentos prescritos
        this.medicamentos = entity.getPrescricoesMedicamentos() == null ? 
        List.of() :
        entity.getPrescricoesMedicamentos()
            .stream()
            .map(pm -> pm.getMedicamento().getNome())
            .collect(Collectors.toList());

        // Lista de exames prescritos
        this.exames = entity.getPrescricoesExames() == null ?
            List.of() :
            entity.getPrescricoesExames()
                .stream()
                .map(ex -> ex.getExame().getNome_exame())
                .collect(Collectors.toList());
    }

    public PrescricaoMedicaDTO(){}

    public long getId_prescricao() { return id_prescricao; }
    public void setId_prescricao(long id_prescricao) { this.id_prescricao = id_prescricao; }

    public String getData_prescricao() { return data_prescricao; }
    public void setData_prescricao(String data_prescricao) { this.data_prescricao = data_prescricao; }

    public String getObservacoes() { return observacoes; }
    public void setObservacoes(String observacoes) { this.observacoes = observacoes; }

    public long getId_medico() { return id_medico; }
    public void setId_medico(long id_medico) { this.id_medico = id_medico; }

    public String getNomeMedico() { return nomeMedico; }
    public void setNomeMedico(String nomeMedico) { this.nomeMedico = nomeMedico; }

    public long getId_usuario() { return id_usuario; }
    public void setId_usuario(long id_usuario) { this.id_usuario = id_usuario; }

    public List<String> getMedicamentos() { return medicamentos; }
    public void setMedicamentos(List<String> medicamentos) { this.medicamentos = medicamentos; }

    public List<String> getExames() { return exames; }
    public void setExames(List<String> exames) { this.exames = exames; }
}
