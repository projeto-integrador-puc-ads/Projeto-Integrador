package br.pucgo.ads.projetointegrador.diario_saude.service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import br.pucgo.ads.projetointegrador.diario_saude.dto.PrescricaoExercicioDTO;
import br.pucgo.ads.projetointegrador.diario_saude.entity.PrescricaoExercicioEntity;
import br.pucgo.ads.projetointegrador.diario_saude.repository.PrescricaoExercicioRepository;
import br.pucgo.ads.projetointegrador.diario_saude.repository.PrescricaoMedicaRepository;
import br.pucgo.ads.projetointegrador.diario_saude.repository.ExercicioRepository;

@Service
public class PrescricaoExercicioService {

    @Autowired
    private PrescricaoExercicioRepository repository;

    @Autowired
    private PrescricaoMedicaRepository prescricaoMedicaRepository;

    @Autowired
    private ExercicioRepository exercicioRepository;

    public List<PrescricaoExercicioDTO> listarTodos(){
        return repository.findAll().stream().map(PrescricaoExercicioDTO::new).toList();
    }

    public void inserir(PrescricaoExercicioDTO dto){
        PrescricaoExercicioEntity entity = new PrescricaoExercicioEntity(dto);
        entity.setPrescricaoMedica(prescricaoMedicaRepository.findById(dto.getId_prescricao()).get());
        entity.setExercicio(exercicioRepository.findById(dto.getId_exercicio()).get());
        repository.save(entity);
    }

    public PrescricaoExercicioDTO alterar(PrescricaoExercicioDTO dto){
        PrescricaoExercicioEntity entity = new PrescricaoExercicioEntity(dto);
        entity.setPrescricaoMedica(prescricaoMedicaRepository.findById(dto.getId_prescricao()).get());
        entity.setExercicio(exercicioRepository.findById(dto.getId_exercicio()).get());
        return new PrescricaoExercicioDTO(repository.save(entity));
    }

    public void excluir(Long id){
        repository.delete(repository.findById(id).get());
    }

    public PrescricaoExercicioDTO buscarPorId(Long id){
        return new PrescricaoExercicioDTO(repository.findById(id).get());
    }
}
