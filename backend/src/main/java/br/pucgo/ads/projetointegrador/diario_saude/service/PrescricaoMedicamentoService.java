package br.pucgo.ads.projetointegrador.diario_saude.service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import br.pucgo.ads.projetointegrador.diario_saude.dto.PrescricaoMedicamentoDTO;
import br.pucgo.ads.projetointegrador.diario_saude.entity.MedicamentoEntity;
import br.pucgo.ads.projetointegrador.diario_saude.entity.PrescricaoMedicaEntity;
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

    public List<PrescricaoMedicamentoDTO> listarTodos(){
        return repo.findAll().stream().map(PrescricaoMedicamentoDTO::new).toList();
    }

    public void inserir(PrescricaoMedicamentoDTO dto){
        PrescricaoMedicamentoEntity entity = new PrescricaoMedicamentoEntity(dto);
        entity.setMedicamento(medicamentoRepo.findById(dto.getId_medicamento()).get());
        entity.setPrescricaoMedica(prescricaoRepo.findById(dto.getId_prescricao()).get());
        repo.save(entity);
    }

    public PrescricaoMedicamentoDTO alterar(PrescricaoMedicamentoDTO dto){
        PrescricaoMedicamentoEntity entity = new PrescricaoMedicamentoEntity(dto);
        entity.setMedicamento(medicamentoRepo.findById(dto.getId_medicamento()).get());
        entity.setPrescricaoMedica(prescricaoRepo.findById(dto.getId_prescricao()).get());
        return new PrescricaoMedicamentoDTO(repo.save(entity));
    }

    public void excluir(Long id){
        repo.delete(repo.findById(id).get());
    }
}
