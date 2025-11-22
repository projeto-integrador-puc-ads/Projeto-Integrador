package br.pucgo.ads.projetointegrador.diario_saude.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import br.pucgo.ads.projetointegrador.diario_saude.dto.PrescricaoMedicamentoDTO;
import br.pucgo.ads.projetointegrador.diario_saude.entity.PrescricaoMedicamentoEntity;
import br.pucgo.ads.projetointegrador.diario_saude.repository.MedicamentoRepository;
import br.pucgo.ads.projetointegrador.diario_saude.repository.PrescricaoMedicaRepository;
import br.pucgo.ads.projetointegrador.diario_saude.repository.PrescricaoMedicamentoRepository;

@Service
public class PrescricaoMedicamentoService {

    @Autowired
    private PrescricaoMedicamentoRepository repo;

    @Autowired
    private MedicamentoRepository medicamentoRepo;

    @Autowired
    private PrescricaoMedicaRepository prescricaoRepo;

    // Listar todos os medicamentos
    public List<PrescricaoMedicamentoDTO> listarTodos() {
        return repo.findAll().stream()
                   .map(PrescricaoMedicamentoDTO::new)
                   .toList();
    }

    // Inserir novo medicamento na prescrição
    public void inserir(PrescricaoMedicamentoDTO dto) {
        PrescricaoMedicamentoEntity entity = new PrescricaoMedicamentoEntity();
        entity.setDosagem(dto.getDosagem());
        entity.setFrequencia(dto.getFrequencia());
        entity.setConcentracao(dto.getConcentracao());
        entity.setVia(dto.getVia());

        if (dto.getId_medicamento() != 0) {
            // medicamento existente no banco
            var med = medicamentoRepo.findById(dto.getId_medicamento()).orElseThrow();
            entity.setMedicamento(med);
            entity.setNome_medicamento(med.getNome());
        } else {
            // medicamento digitado manualmente
            entity.setMedicamento(null);
            entity.setNome_medicamento(dto.getNome_medicamento());
        }

        entity.setPrescricaoMedica(prescricaoRepo.findById(dto.getId_prescricao()).orElseThrow());

        repo.save(entity);
    }

    // Alterar medicamento existente
    public PrescricaoMedicamentoDTO alterar(PrescricaoMedicamentoDTO dto) {
        PrescricaoMedicamentoEntity entity = repo.findById(dto.getId_prescricao_medicamento())
                                                 .orElseThrow();

        entity.setDosagem(dto.getDosagem());
        entity.setFrequencia(dto.getFrequencia());
        entity.setConcentracao(dto.getConcentracao());
        entity.setVia(dto.getVia());

        entity.setMedicamento(medicamentoRepo.findById(dto.getId_medicamento()).orElseThrow());
        entity.setPrescricaoMedica(prescricaoRepo.findById(dto.getId_prescricao()).orElseThrow());

        return new PrescricaoMedicamentoDTO(repo.save(entity));
    }

    // Excluir medicamento da prescrição
    public void excluir(Long id) {
        PrescricaoMedicamentoEntity entity = repo.findById(id).orElseThrow();
        repo.delete(entity);
    }
}
